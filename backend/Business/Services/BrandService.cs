using MarketFlow.Business.Interfaces;
using MarketFlow.DataAccess.Interfaces;
using MarketFlow.DTOs.Brand;
using MarketFlow.DTOs.Category;
using MarketFlow.DTOs.Supplier;
using MarketFlow.Utilities;
using MarketFlow.Utilities.Extensions;
using MarketFlow.Utilities.ResultCodes;
using Microsoft.Extensions.Options;

namespace MarketFlow.Business.Services
{
    public class BrandService : IBrandService
    {
        private readonly IBrandRepository _repo;
        private readonly IImageProcessor _imageProcessor;
        //private readonly IImageService _imageService;
        //private readonly IOptions<ImageSettings> _imageSettings;
        private readonly string _folderName;

        public BrandService(IBrandRepository repo,
            IImageProcessor imageProcessor,
            IOptions<ImageSettings> imageSettings)
        {
            _repo = repo;
            _imageProcessor = imageProcessor;
            //_imageSettings = imageSettings;
            _folderName = imageSettings.Value.BrandFolder;
        }


        #region Add
        public async Task<Result<BrandDTO>> AddAsync(BrandDTO dto)
        {
            var entity = dto.ToEntity();

            var imageResult = await _imageProcessor.ProcessImageAsync(
                dto.ImageFile, dto.ImageUrl, null, _folderName);

            if (!imageResult.IsSuccess)
            {
                return Result<BrandDTO>.Failure(imageResult.Code, 500);
            }

            entity.ImageUrl = imageResult.Data;

            var addResult = await _repo.AddAndSaveAsync(entity);

            if (!addResult.IsSuccess)
            {
                if  (dto.ImageFile != null)
                {
                    await _imageProcessor.DeleteLocalFile(entity.ImageUrl, _folderName);
                }
                return Result<BrandDTO>.Failure();
            }

            var result = addResult.Data?.ToDTO();
            if (result != null)
            {
                result.ImageUrl = ImageHelper.ToAbsoluteUrl(result.ImageUrl, _folderName);
            }


            return Result<BrandDTO>.Success(result);
        }
        #endregion

        #region Get
        public async Task<Result<BrandDTO>> GetByIdAsync(int id)
        {
            var findResult = await _repo.FindByAsync(c => c.Id == id);

            if (!findResult.IsSuccess || findResult.Data == null)
            {
                return Result<BrandDTO>.Failure(
                    ResultCodes.BrandNotFound,
                    404);
            }

            var result = findResult.Data?.ToDTO();
            result.ImageUrl = ImageHelper.ToAbsoluteUrl(result.ImageUrl, _folderName);

            return Result<BrandDTO>.Success(result);
        }

        public async Task<Result<IEnumerable<BrandDTO>>> GetAllAsync()
        {
            var categoriesResult = await _repo.GetAllAsync();

            if (!categoriesResult.IsSuccess || categoriesResult.Data == null)
            {
                return Result<IEnumerable<BrandDTO>>.Failure();
            }

            var result = new List<BrandDTO>();

            foreach (var item in categoriesResult.Data)
            {
                var newItem = item.ToDTO();
                newItem.ImageUrl = ImageHelper.ToAbsoluteUrl(newItem.ImageUrl, _folderName);
                result.Add(newItem);
            }

            return Result<IEnumerable<BrandDTO>>.Success(result);
        }
        #endregion

        #region Update
        public async Task<Result<BrandDTO>> UpdateAsync(int id, BrandDTO dto)
        {
            var existingResult = await _repo.FindByAsync(c => c.Id == id);
            if (!existingResult.IsSuccess || existingResult.Data == null)
            {
                return Result<BrandDTO>.Failure(
                    ResultCodes.BrandNotFound,
                    404,
                    "Brand not found");
            }

            var entity = existingResult.Data;

            var imageResult = await _imageProcessor.ProcessImageAsync(
                dto.ImageFile, dto.ImageUrl, entity.ImageUrl, _folderName);

            if (!imageResult.IsSuccess)
            {
                return Result<BrandDTO>.Failure(imageResult.Code, 500);
            }

            entity.UpdateFromDTO(dto);      

            entity.ImageUrl = imageResult.Data;

            var updateResult = await _repo.UpdateAndSaveAsync(existingResult.Data);

            if (!updateResult.IsSuccess)
            {
                return Result<BrandDTO>.Failure(updateResult.Code, 500);
            }

            var result = updateResult.Data?.ToDTO();
            if (result != null)
            {
                result.ImageUrl = ImageHelper.ToAbsoluteUrl(result.ImageUrl, _folderName);
            }

            return Result<BrandDTO>.Success(result);

        }
        #endregion

        #region Delete
        public async Task<Result<bool>> DeleteAsync(int id)
        {
            var findResult = await GetByIdAsync(id);
            if (!findResult.IsSuccess)
            {
                return Result<bool>.Failure(
                    ResultCodes.BrandNotFound,
                    404);
            }


            return await _repo.DeleteAndSaveAsync(id);
        }
        #endregion

    }
}
