using MarketFlow.Business.Interfaces;
using MarketFlow.DataAccess.Interfaces;
using MarketFlow.DTOs.Brand;
using MarketFlow.DTOs.Category;
using MarketFlow.DTOs.Supplier;
using MarketFlow.Utilities;
using MarketFlow.Utilities.Extensions;
using MarketFlow.Utilities.ResultCodes;
using Microsoft.Extensions.Options;
using Microsoft.JSInterop.Infrastructure;

namespace MarketFlow.Business.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repo;
        private readonly IImageProcessor _imageProcessor;
        //private readonly IOptions<ImageSettings> _imageSettings;
        private readonly string _folderName;

        public CategoryService(ICategoryRepository repo,
            IImageProcessor imageProcessor,
            IOptions<ImageSettings> imageSettings)
        {
            _repo = repo;
            _imageProcessor = imageProcessor;
            //_imageSettings = imageSettings;
            _folderName = imageSettings.Value.CategoryFolder;
        }


        #region Add
        public async Task<Result<CategoryDTO>> AddAsync(CategoryDTO dto)
        {
            var entity = dto.ToEntity();

            var imageResult = await _imageProcessor.ProcessImageAsync(
                dto.ImageFile, dto.ImageUrl, null, _folderName);

            if (!imageResult.IsSuccess)
            {
                return Result<CategoryDTO>.Failure(imageResult.Code, 500);
            }

            entity.ImageUrl = imageResult.Data;

            var addResult = await _repo.AddAndSaveAsync(entity);

            if (!addResult.IsSuccess)
            {
                if (dto.ImageFile != null)
                {
                    await _imageProcessor.DeleteLocalFile(entity.ImageUrl, _folderName);
                }
                return Result<CategoryDTO>.Failure();
            }

            var result = addResult.Data?.ToDTO();
            if (result != null)
            {
                result.ImageUrl = ImageHelper.ToAbsoluteUrl(result.ImageUrl, _folderName);
            }


            return Result<CategoryDTO>.Success(result);
        }
        #endregion

        #region Get
        public async Task<Result<CategoryDTO>> GetByIdAsync(int id)
        {
            var findResult = await _repo.FindByAsync(c => c.Id == id);

            if (!findResult.IsSuccess || findResult.Data == null)
            {
                return Result<CategoryDTO>.Failure(
                    ResultCodes.CategoryNotFound,
                    404);
            }

            var result = findResult.Data?.ToDTO();
            result.ImageUrl = ImageHelper.ToAbsoluteUrl(result.ImageUrl, _folderName);

            return Result<CategoryDTO>.Success(result);
        }

        public async Task<Result<IEnumerable<CategoryDTO>>> GetAllAsync()
        {
            var categoriesResult = await _repo.GetAllAsync();

            if (!categoriesResult.IsSuccess || categoriesResult.Data == null)
            {
                return Result<IEnumerable<CategoryDTO>>.Failure();
            }

            var result = new List<CategoryDTO>();

            foreach (var item in categoriesResult.Data)
            {
                var newItem = item.ToDTO();
                newItem.ImageUrl = 
                    ImageHelper.ToAbsoluteUrl(newItem.ImageUrl, _folderName);
                result.Add(newItem);
            }

            return Result<IEnumerable<CategoryDTO>>.Success(result);
        }
        #endregion

        #region Update
        public async Task<Result<CategoryDTO>> UpdateAsync(int id, CategoryDTO dto)
        {
            var existingResult = await _repo.FindByAsync(c => c.Id == id);
            if (!existingResult.IsSuccess || existingResult.Data == null)
            {
                return Result<CategoryDTO>.Failure(
                    ResultCodes.CategoryNotFound,
                    404,
                    "Category not found");
            }

            var entity = existingResult.Data;

            var imageResult = await _imageProcessor.ProcessImageAsync(
                dto.ImageFile, dto.ImageUrl, entity.ImageUrl, _folderName);

            if (!imageResult.IsSuccess)
            {
                return Result<CategoryDTO>.Failure(imageResult.Code, 500);
            }

            entity.UpdateFromDTO(dto);

            entity.ImageUrl = imageResult.Data;

            var updateResult = await _repo.UpdateAndSaveAsync(existingResult.Data);

            if (!updateResult.IsSuccess)
            {
                return Result<CategoryDTO>.Failure(updateResult.Code, 500);
            }

            var result = updateResult.Data?.ToDTO();
            if (result != null)
            {
                result.ImageUrl = ImageHelper.ToAbsoluteUrl(result.ImageUrl, _folderName);
            }

            return Result<CategoryDTO>.Success(result);

        }
        #endregion

        #region Delete
        public async Task<Result<bool>> DeleteAsync(int id)
        {
            var findResult = await GetByIdAsync(id);
            if (!findResult.IsSuccess)
            {
                return Result<bool>.Failure(
                    ResultCodes.CategoryNotFound,
                    findResult.StatusCode);
            }


            return await _repo.DeleteAndSaveAsync(id);
        }
        #endregion

    }
}
