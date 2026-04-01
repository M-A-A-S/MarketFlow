using MarketFlow.Business.Interfaces;
using MarketFlow.DataAccess.Interfaces;
using MarketFlow.DTOs.Category;
using MarketFlow.DTOs.Supplier;
using MarketFlow.Utilities;
using MarketFlow.Utilities.Extensions;
using MarketFlow.Utilities.ResultCodes;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace MarketFlow.Business.Services
{
    public class SupplierService : ISupplierService
    {
        private readonly ISupplierRepository _repo;
        private readonly IImageProcessor _imageProcessor;
        private readonly string _folderName;

        public SupplierService(ISupplierRepository repo,
            IImageProcessor imageProcessor,
            IOptions<ImageSettings> imageSettings)
        {
            _repo = repo;
            _imageProcessor = imageProcessor;
            _folderName = imageSettings.Value.ProfileFolder;
        }


        #region Add
        public async Task<Result<SupplierDTO>> AddAsync(SupplierDTO dto)
        {
            var entity = dto.ToEntity();

            var imageResult = await _imageProcessor.ProcessImageAsync(
                dto.Person.ImageFile, dto.Person.ImageUrl, null, _folderName);

            if (!imageResult.IsSuccess)
            {
                return Result<SupplierDTO>.Failure(imageResult.Code, 500);
            }

            entity.Person.ImageUrl = imageResult.Data;

            var addResult = await _repo.AddAndSaveAsync(entity);

            if (!addResult.IsSuccess)
            {
                if (dto.Person.ImageFile != null)
                {
                    await _imageProcessor.DeleteLocalFile(entity.Person.ImageUrl, _folderName);
                }
                return Result<SupplierDTO>.Failure();
            }

            var result = addResult.Data?.ToDTO();
            if (result != null)
            {
                result.Person.ImageUrl = ImageHelper.ToAbsoluteUrl(result.Person.ImageUrl, _folderName);
            }


            return Result<SupplierDTO>.Success(result);
        }
        #endregion

        #region Get
        public async Task<Result<SupplierDTO>> GetByIdAsync(int id)
        {
            var findResult = await _repo.FindByAsync(s => s.Id == id, include: q => q.Include(s => s.Person));

            if (!findResult.IsSuccess || findResult.Data == null)
            {
                return Result<SupplierDTO>.Failure(
                    ResultCodes.SupplierNotFound,
                    404);
            }

            var result = findResult.Data?.ToDTO();
            result.Person.ImageUrl = ImageHelper.ToAbsoluteUrl(result.Person.ImageUrl, _folderName);

            return Result<SupplierDTO>.Success(result);
        }

        public async Task<Result<IEnumerable<SupplierDTO>>> GetAllAsync()
        {
            var suppliersResult = await _repo.GetAllAsync(include: q => q.Include(s => s.Person));

            if (!suppliersResult.IsSuccess || suppliersResult.Data == null)
            {
                return Result<IEnumerable<SupplierDTO>>.Failure();
            }

            var result = new List<SupplierDTO>();

            foreach (var item in suppliersResult.Data)
            {
                var newItem = item.ToDTO();
                newItem.Person.ImageUrl =
                    ImageHelper.ToAbsoluteUrl(newItem.Person.ImageUrl, _folderName);
                result.Add(newItem);
            }

            return Result<IEnumerable<SupplierDTO>>.Success(result);
        }
        #endregion

        #region Update
        public async Task<Result<SupplierDTO>> UpdateAsync(int id, SupplierDTO dto)
        {
            var existingResult = await _repo.FindByAsync(c => c.Id == id, include: q => q.Include(s => s.Person));
            if (!existingResult.IsSuccess || existingResult.Data == null)
            {
                return Result<SupplierDTO>.Failure(
                    ResultCodes.SupplierNotFound,
                    404,
                    "Supplier not found");
            }

            var entity = existingResult.Data;

            var imageResult = await _imageProcessor.ProcessImageAsync(
                dto?.Person?.ImageFile, dto?.Person?.ImageUrl, entity?.Person?.ImageUrl, _folderName);

            if (!imageResult.IsSuccess)
            {
                return Result<SupplierDTO>.Failure(imageResult.Code, 500);
            }

            entity.UpdateFromDTO(dto);

            entity.Person.ImageUrl = imageResult.Data;

            var updateResult = await _repo.UpdateAndSaveAsync(existingResult.Data);

            if (!updateResult.IsSuccess)
            {
                return Result<SupplierDTO>.Failure(updateResult.Code, 500);
            }

            var result = updateResult.Data?.ToDTO();
            if (result != null)
            {
                result.Person.ImageUrl = ImageHelper.ToAbsoluteUrl(result.Person.ImageUrl, _folderName);
            }

            return Result<SupplierDTO>.Success(result);

        }
        #endregion

        #region Delete
        public async Task<Result<bool>> DeleteAsync(int id)
        {
            var findResult = await GetByIdAsync(id);
            if (!findResult.IsSuccess)
            {
                return Result<bool>.Failure(
                    ResultCodes.SupplierNotFound,
                    findResult.StatusCode);
            }

            return await _repo.DeleteAndSaveAsync(id);
        }
        #endregion
    }
}
