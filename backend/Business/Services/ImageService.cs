using MarketFlow.Business.Interfaces;
using MarketFlow.Utilities;
using MarketFlow.Utilities.ResultCodes;
using System.Security;

namespace MarketFlow.Business.Services
{
    public class ImageService : IImageService
    {
        private readonly IWebHostEnvironment _env;
        private const long MaxFileSize = 5 * 1024 * 1024;

        private static readonly Dictionary<string, byte[]> ImageSignatures = new()
        {
            { ".jpg", new byte[] { 0xFF, 0xD8 } },
            { ".jpeg", new byte[] { 0xFF, 0xD8 } },
            { ".png", new byte[] { 0x89, 0x50 } },
            { ".gif", new byte[] { 0x47, 0x49 } },
            { ".webp", new byte[] { 0x52, 0x49 } }
        };

        public ImageService(IWebHostEnvironment env)
        {
            _env = env ?? throw new ArgumentNullException(nameof(env));
        }

        // ===================== VALIDATION =====================
        private Result<bool> ValidateImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return Result<bool>.Failure(ResultCodes.EmptyFile);
            }

            if (file.Length > MaxFileSize)
            {
                return Result<bool>.Failure(ResultCodes.FileExceedsMaxSize);
            }

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!ImageSignatures.ContainsKey(extension))
            {
                return Result<bool>.Failure(ResultCodes.InvalidFileType);
            }

            if (!IsValidImageContent(file, ImageSignatures[extension]))
            {
                return Result<bool>.Failure(ResultCodes.InvalidImageContent);
            }
            return Result<bool>.Success(true, ResultCodes.ImageValidated);

        }

        private bool IsValidImageContent(IFormFile file, byte[] signature)
        {
            using var stream = file.OpenReadStream();
            var buffer = new byte[signature.Length];
            stream.Read(buffer, 0, buffer.Length);
            return buffer.SequenceEqual(signature);
        }

        // ===================== PATH SAFETY =====================
        private string UploadRoot =>
      Path.Combine(_env.WebRootPath, "Uploads");

        private string GetSafeFullPath(string relativePath)
        {
            var fullPath = Path.GetFullPath(
                Path.Combine(UploadRoot, relativePath)
            );

            if (!fullPath.StartsWith(UploadRoot))
                throw new SecurityException("Invalid path traversal");

            return fullPath;
        }

        // ===================== SAVE =====================
        public async Task<Result<string>> SaveImageAsync(IFormFile image, string folderName)
        {
            var validation = ValidateImage(image);
            if (!validation.IsSuccess)
            {
                return Result<string>.Failure(validation.Code);
            }

            var extension = Path.GetExtension(image.FileName);
            var fileName = $"{Guid.NewGuid()}{extension}";
            var folderPath = Path.Combine(UploadRoot, folderName);

            Directory.CreateDirectory(folderPath);

            var fullPath = Path.Combine(folderPath, fileName);

            await using var stream = new FileStream(fullPath, FileMode.CreateNew);
            await image.CopyToAsync(stream);

            var relativePath = Path.Combine(folderName, fileName).Replace("\\", "/");

            return Result<string>.Success(relativePath, ResultCodes.ImageSaved);
        }

        // ===================== DELETE =====================
        public async Task<Result<bool>> DeleteImage(string relativePath)
        {
            if (string.IsNullOrWhiteSpace(relativePath))
            {
                return Result<bool>.Failure(ResultCodes.InvalidImageUrl);
            }

            // If it's an external URL, skip deleting
            if (Uri.TryCreate(relativePath, UriKind.Absolute, out var uriResult)
                && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps))
            {
                return Result<bool>.Success(true, ResultCodes.ImageDeleted);
            }

            try
            {
                var fullPath = GetSafeFullPath(relativePath);

                if (!File.Exists(fullPath))
                {
                    return Result<bool>.Success(true, ResultCodes.FileAlreadyDeleted);
                }

                await Task.Run(() => File.Delete(fullPath));
                return Result<bool>.Success(true, ResultCodes.ImageDeleted);
            }
            catch (SecurityException)
            {
                return Result<bool>.Failure(ResultCodes.InvalidPath);
            }
            catch
            {
                return Result<bool>.Failure(ResultCodes.ServerError, 500);
            }
        }
        // ===================== REPLACE =====================
        public async Task<Result<string>> ReplaceImageAsync(
    string? oldRelativePath,
    IFormFile newImage,
    string folderName)
        {
            // Delete old image first
            if (!string.IsNullOrWhiteSpace(oldRelativePath))
            {
                var deleteResult = await DeleteImage(oldRelativePath);
                if (!deleteResult.IsSuccess)
                {
                    return Result<string>.Failure(deleteResult.Code);
                }
            }

            // Save new image
            var saveResult = await SaveImageAsync(newImage, folderName);
            if (!saveResult.IsSuccess)
            {
                return saveResult;
            }

            return saveResult;
        }
    }
}
