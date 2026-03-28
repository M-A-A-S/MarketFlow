using MarketFlow.Business.Interfaces;
using MarketFlow.DataAccess.Interfaces;
using MarketFlow.DTOs.Brand;
using MarketFlow.DTOs.Category;
using MarketFlow.DTOs.Product;
using MarketFlow.Entities;
using MarketFlow.Enums;
using MarketFlow.Utilities;
using MarketFlow.Utilities.Extensions;
using MarketFlow.Utilities.ResultCodes;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Linq.Expressions;

namespace MarketFlow.Business.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repo;
        private readonly IImageService _imageService;
        private readonly IOptions<ImageSettings> _imageSettings;

        public ProductService(IProductRepository repo,
            IImageService imageService,
            IOptions<ImageSettings> imageSettings)
        {
            _repo = repo;
            _imageService = imageService;
            _imageSettings = imageSettings;
        }


        #region Add
        public async Task<Result<ProductDTO>> AddAsync(ProductDTO dto)
        {
            var entity = dto.ToEntity();
            entity.ImageUrl = await ProcessImageAsync(dto.ImageFile, dto.ImageUrl);

            var addResult = await _repo.AddAndSaveAsync(entity);

            if (!addResult.IsSuccess && dto.ImageFile != null)
            {
                await _imageService.DeleteImage(entity.ImageUrl);
            }

            var result = addResult.Data?.ToDTO();
            if (result != null)
            {
                result.ImageUrl = ToAbsoluteUrl(result.ImageUrl);
            }


            return Result<ProductDTO>.Success(result);
        }
        #endregion

        #region Get
        public async Task<Result<ProductDTO>> GetByIdAsync(int id)
        {
            var findResult = await _repo.FindByAsync(c => c.Id == id);

            if (!findResult.IsSuccess || findResult.Data == null)
            {
                return Result<ProductDTO>.Failure(
                    ResultCodes.ProductNotFound,
                    404);
            }
            var result = findResult.Data?.ToDTO();
            result.ImageUrl = ToAbsoluteUrl(result.ImageUrl);

            return Result<ProductDTO>.Success(result);
        }

        public async Task<Result<IEnumerable<ProductDTO>>> GetAllAsync()
        {
            var categoriesResult = await _repo.GetAllAsync();

            if (!categoriesResult.IsSuccess || categoriesResult.Data == null)
            {
                return Result<IEnumerable<ProductDTO>>.Failure();
            }

            var result = new List<ProductDTO>();

            foreach (var item in categoriesResult.Data)
            {
                var newItem = item.ToDTO();
                newItem.ImageUrl = ToAbsoluteUrl(newItem.ImageUrl);
                result.Add(newItem);
            }

            return Result<IEnumerable<ProductDTO>>.Success(result);
        }

        public async Task<Result<PagedResult<ProductDTO>>> GetFilteredAsync(ProductFilterDTO filter)
        {
  
            var predicate = BuildFilterExpression(filter);
            var orderBy = BuildOrderByExpression(filter);

            var getPagedResult = await _repo.GetPagedAsync(
                filter: predicate,
                include: q => q.Include(p => p.Category).Include(p => p.Brand),
                orderBy: orderBy,
                pageNumber: filter.PageNumber,
                pageSize: filter.PageSize
               );

            if (!getPagedResult.IsSuccess || getPagedResult.Data == null)
            {
                return Result<PagedResult<ProductDTO>>.Failure();
            }

            var result = new PagedResult<ProductDTO>()
            {
                Items = getPagedResult.Data.Items.Select(p =>
                {
                    var dto = p.ToDTO();
                    dto.ImageUrl = ToAbsoluteUrl(dto.ImageUrl);
                    return dto;
                }).ToList(),

                Total = getPagedResult.Data.Total,
                PageSize = getPagedResult.Data.PageSize,
                PageNumber = getPagedResult.Data.PageNumber,
            };

            return Result<PagedResult<ProductDTO>>.Success(result);


        }

        #endregion

        #region Update
        public async Task<Result<ProductDTO>> UpdateAsync(int id, ProductDTO dto)
        {
            var existingResult = await _repo.FindByAsync(c => c.Id == id);
            if (!existingResult.IsSuccess || existingResult.Data == null)
            {
                return Result<ProductDTO>.Failure(
                    ResultCodes.CategoryNotFound,
                    404,
                    "Category not found");
            }

            var entity = existingResult.Data;
            entity.ImageUrl = await ProcessImageAsync(
                dto.ImageFile, dto.ImageUrl,
                dto.DeleteImage, entity.ImageUrl);


            entity.UpdateFromDTO(dto);

            var updateResult = await _repo.UpdateAndSaveAsync(existingResult.Data);

            var result = updateResult.Data?.ToDTO();
            if (result != null)
            {
                result.ImageUrl = ToAbsoluteUrl(result.ImageUrl);
            }

            return Result<ProductDTO>.Success(result);

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


        #region Private Helpers

        private async Task<string?> ProcessImageAsync(
            IFormFile? imageFile,
            string? imageUrl,
            bool deleteOld = false,
            string? oldImage = null)
        {
            string? finalImage = oldImage;

            // Delete old image if requested
            if (deleteOld && !string.IsNullOrWhiteSpace(oldImage))
            {
                var deleteResult = await _imageService.DeleteImage(
                    Path.Combine(_imageSettings.Value.CategoryFolder, oldImage));
                if (!deleteResult.IsSuccess)
                    throw new InvalidOperationException($"Failed to delete image: {deleteResult.Code}");

                finalImage = null;
            }

            // Save or replace image file
            if (imageFile != null)
            {
                var replaceResult = await _imageService.ReplaceImageAsync(oldImage, imageFile, _imageSettings.Value.CategoryFolder);
                if (!replaceResult.IsSuccess)
                    throw new InvalidOperationException($"Failed to save image: {replaceResult.Code}");

                finalImage = replaceResult.Data;
            }

            // Handle ImageUrl (external or internal)
            else if (!string.IsNullOrWhiteSpace(imageUrl) && imageUrl.IsValidImageUrl())
            {
                finalImage = Uri.TryCreate(imageUrl, UriKind.Absolute, out _) ? imageUrl : Path.GetFileName(imageUrl);
            }
            else
            {
                finalImage = null;
            }

            return finalImage;
        }


        private string? ToAbsoluteUrl(string? fileName)
        {
            if (string.IsNullOrWhiteSpace(fileName))
            {
                return null;
            }

            // External URL: return as-is
            if (Uri.TryCreate(fileName, UriKind.Absolute, out _))
            {
                return fileName;
            }

            return ImageUrlHelper.ToAbsoluteUrl(
                _imageService.GetFullPath(
                    _imageSettings.Value.CategoryFolder, fileName));
        }


        private Expression<Func<Product, bool>> BuildFilterExpression(ProductFilterDTO filter)
        {
            return p =>
                (
                    string.IsNullOrEmpty(filter.Search) ||
                    p.NameEn.Contains(filter.Search) ||
                    p.NameAr.Contains(filter.Search) ||
                    p.DescriptionEn.Contains(filter.Search) ||
                    p.DescriptionAr.Contains(filter.Search)
                ) &&

                (!filter.CategoryId.HasValue || p.CategoryId == filter.CategoryId) &&
                (!filter.BrandId.HasValue || p.BrandId == filter.BrandId) &&
                (!filter.IsActive.HasValue || p.IsActive == filter.IsActive) &&
                (!filter.MinPrice.HasValue || p.Price >= filter.MinPrice) &&
                (!filter.MaxPrice.HasValue || p.Price <= filter.MaxPrice);
        }

        private Func<IQueryable<Product>, IOrderedQueryable<Product>> BuildOrderByExpression(ProductFilterDTO filter)
        {
            return filter.SortBy switch
            {
                ProductSortBy.Newest => q => q.OrderByDescending(p => p.Id),
                ProductSortBy.Oldest => q => q.OrderBy(p => p.Id),
                ProductSortBy.PriceDesc => q => q.OrderByDescending(p => p.Price),
                ProductSortBy.PriceAsc => q => q.OrderBy(p => p.Price),
                ProductSortBy.NameEnDesc => q => q.OrderByDescending(p => p.NameEn),
                ProductSortBy.NameEnAsc => q => q.OrderBy(p => p.NameEn),
                ProductSortBy.NameArDesc => q => q.OrderByDescending(p => p.NameAr),
                ProductSortBy.NameArAsc => q => q.OrderBy(p => p.NameAr),
                ProductSortBy.DescriptionEnDesc => q => q.OrderByDescending(p => p.DescriptionEn),
                ProductSortBy.DescriptionEnAsc => q => q.OrderBy(p => p.DescriptionEn),
                ProductSortBy.DescriptionArDesc => q => q.OrderByDescending(p => p.DescriptionAr),
                ProductSortBy.DescriptionArAsc => q => q.OrderBy(p => p.DescriptionAr),
                _ => q => q.OrderByDescending(p => p.Id)
            };
        }

        #endregion
    }
}
