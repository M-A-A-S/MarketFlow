using MarketFlow.Utilities;

namespace MarketFlow.Business.Interfaces
{
    public interface IImageProcessor
    {
        Task<Result<string?>> ProcessImageAsync(
        IFormFile? imageFile,
        string? incomingUrl,
        string? oldImage,
        string folderName);

        Task<Result<bool>> DeleteLocalFile(string? fileName, string folderName);
    }
}
