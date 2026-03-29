using MarketFlow.Utilities;

namespace MarketFlow.Business.Interfaces
{
    public interface IImageService
    {
        Task<Result<string>> SaveImageAsync(IFormFile image, string folderName);
        Task<Result<bool>> DeleteImage(string relativePath);
        Task<Result<string>> ReplaceImageAsync(
            string? oldRelativePath,
            IFormFile newImage,
            string folderName);
    }
}
