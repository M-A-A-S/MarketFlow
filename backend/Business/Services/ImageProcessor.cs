using MarketFlow.Business.Interfaces;
using MarketFlow.Utilities;
using MarketFlow.Utilities.ResultCodes;

namespace MarketFlow.Business.Services
{
    public class ImageProcessor : IImageProcessor
    {
        private readonly IImageService _imageService;

        public ImageProcessor(IImageService imageService)
        {
            _imageService = imageService;
        }

        public async Task<Result<string?>> ProcessImageAsync(
    IFormFile? imageFile,
    string? incomingUrl,
    string? oldImage,
    string folderName)
        {
            // New file uploaded → replace old
            if (imageFile != null)
            {
                // Delete old local file if it exists and is not external
                if (!string.IsNullOrWhiteSpace(oldImage) && !Uri.IsWellFormedUriString(oldImage, UriKind.Absolute))
                {
                    var deleteOldResult = await DeleteLocalFile(oldImage, folderName);
                    if (!deleteOldResult.IsSuccess)
                        return Result<string?>.Failure(deleteOldResult.Code);
                }

                // Save new image
                var replaceResult = await _imageService.ReplaceImageAsync(oldImage, imageFile, folderName);
                if (!replaceResult.IsSuccess)
                    return Result<string?>.Failure(replaceResult.Code);

                // Store only the filename in DB
                var fileNameToStore = Path.GetFileName(replaceResult.Data);
                return Result<string?>.Success(fileNameToStore, ResultCodes.ImageSaved);
            }

            // Incoming URL provided
            if (!string.IsNullOrWhiteSpace(incomingUrl))
            {
                // Internal server URL → store just file name
                if (ImageHelper.IsMyServerUrl(incomingUrl))
                {
                    if (!string.IsNullOrWhiteSpace(oldImage) && !Uri.IsWellFormedUriString(oldImage, UriKind.Absolute))
                    {
                        await DeleteLocalFile(oldImage, folderName);
                    }

                    var fileNameToStore = Path.GetFileName(new Uri(incomingUrl).LocalPath);
                    return Result<string?>.Success(fileNameToStore);
                }

                // External URL → delete old local file if exists, keep URL
                if (!string.IsNullOrWhiteSpace(oldImage) && !Uri.IsWellFormedUriString(oldImage, UriKind.Absolute))
                {
                    await DeleteLocalFile(oldImage, folderName);
                }

                return Result<string?>.Success(incomingUrl);
            }

            // No new file or URL → keep old
            return Result<string?>.Success(oldImage);
        }

        public async Task<Result<bool>> DeleteLocalFile(string? fileName, string folderName)
        {
            if (string.IsNullOrWhiteSpace(fileName))
                return Result<bool>.Success(true); // nothing to delete

            // Skip external URLs
            if (Uri.TryCreate(fileName, UriKind.Absolute, out _))
                return Result<bool>.Success(true);

            var fullPath = ImageHelper.GetFullPath(folderName, fileName);
            var deleteResult = await _imageService.DeleteImage(fullPath);

            return deleteResult;
        }



    }
}
