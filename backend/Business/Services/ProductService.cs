using MarketFlow.Business.Interfaces;
using MarketFlow.DataAccess.Interfaces;
using MarketFlow.DTOs.Brand;
using MarketFlow.DTOs.Category;
using MarketFlow.DTOs.Product;
using MarketFlow.DTOs.Supplier;
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
        private readonly IImageProcessor _imageProcessor;
        private readonly string _folderName;

        public ProductService(IProductRepository repo,
            IImageProcessor imageProcessor,
            IOptions<ImageSettings> imageSettings)
        {
            _repo = repo;
            _imageProcessor = imageProcessor;
            _folderName = imageSettings.Value.ProductFolder;
        }


        #region Add
        public async Task<Result<ProductDTO>> AddAsync(ProductDTO dto)
        {
            var entity = dto.ToEntity();

            var imageResult = await _imageProcessor.ProcessImageAsync(
                dto.ImageFile, dto.ImageUrl, null, _folderName);

            if (!imageResult.IsSuccess)
            {
                return Result<ProductDTO>.Failure(imageResult.Code, 500);
            }

            entity.ImageUrl = imageResult.Data;

            var addResult = await _repo.AddAndSaveAsync(entity);

            if (!addResult.IsSuccess)
            {
                if (dto.ImageFile != null)
                {
                    await _imageProcessor.DeleteLocalFile(entity.ImageUrl, _folderName);
                }
                return Result<ProductDTO>.Failure();
            }

            var result = addResult.Data?.ToDTO();
            if (result != null)
            {
                result.ImageUrl = ImageHelper.ToAbsoluteUrl(result.ImageUrl, _folderName);
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
            result.ImageUrl = ImageHelper.ToAbsoluteUrl(result.ImageUrl, _folderName);

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
                newItem.ImageUrl = ImageHelper.ToAbsoluteUrl(newItem.ImageUrl, _folderName);
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
                    dto.ImageUrl = ImageHelper.ToAbsoluteUrl(dto.ImageUrl, _folderName);
                    return dto;
                }).ToList(),

                Total = getPagedResult.Data.Total,
                PageSize = getPagedResult.Data.PageSize,
                PageNumber = getPagedResult.Data.PageNumber,
            };

            return Result<PagedResult<ProductDTO>>.Success(result);


        }

        public async Task<Result<IEnumerable<ProductDropdownDTO>>> GetDropdownAsync(ProductDropdownRequestDTO dto)
        {
            var result = await _repo.GetDropdownAsync(dto.Search);

            if (!result.IsSuccess || result.Data == null || !result.Data.Any())
            {
                return Result<IEnumerable<ProductDropdownDTO>>
                    .Failure(ResultCodes.ProductNotFound, 404);
            }

            var mapped = result.Data.Select(p => new ProductDropdownDTO
            {
                Id = p.Id,
                NameEn = p.NameEn,
                NameAr = p.NameAr,
                Price = p.Price,
            }).ToList();

            return Result<IEnumerable<ProductDropdownDTO>>.Success(mapped);
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

            var imageResult = await _imageProcessor.ProcessImageAsync(
                dto.ImageFile, dto.ImageUrl, entity.ImageUrl, _folderName);

            if (!imageResult.IsSuccess)
            {
                return Result<ProductDTO>.Failure(imageResult.Code, 500);
            }

            entity.UpdateFromDTO(dto);

            entity.ImageUrl = imageResult.Data;

            var updateResult = await _repo.UpdateAndSaveAsync(existingResult.Data);

            if (!updateResult.IsSuccess)
            {
                return Result<ProductDTO>.Failure(updateResult.Code, 500);
            }

            var result = updateResult.Data?.ToDTO();
            if (result != null)
            {
                result.ImageUrl = ImageHelper.ToAbsoluteUrl(result.ImageUrl, _folderName);
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
                    ResultCodes.ProductNotFound,
                    404);
            }


            return await _repo.DeleteAndSaveAsync(id);
        }
        #endregion


        #region Private Helpers

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
