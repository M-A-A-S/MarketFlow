using MarketFlow.Business.Interfaces;
using MarketFlow.DataAccess.Interfaces;
using MarketFlow.DTOs.Brand;
using MarketFlow.DTOs.Customer;
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
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _repo;

        public CustomerService(ICustomerRepository repo)
        {
            _repo = repo;
        }

        #region Add
        public async Task<Result<CustomerDTO>> AddAsync(CustomerDTO dto)
        {
            var entity = dto.ToEntity();

            var addResult = await _repo.AddAndSaveAsync(entity);

            if (!addResult.IsSuccess)
            {
                return Result<CustomerDTO>.Failure(ResultCodes.ServerError, 500);
            }

            var result = addResult.Data?.ToDTO();

            return Result<CustomerDTO>.Success(result);
        }
        #endregion

        #region Get
        public async Task<Result<CustomerDTO>> GetByIdAsync(int id)
        {
            var findResult = await _repo.FindByAsync(c => c.Id == id);

            if (!findResult.IsSuccess || findResult.Data == null)
            {
                return Result<CustomerDTO>.Failure(
                    ResultCodes.CustomerNotFound,
                    404);
            }

            var result = findResult.Data?.ToDTO();

            return Result<CustomerDTO>.Success(result);
        }

        public async Task<Result<IEnumerable<CustomerDTO>>> GetAllAsync()
        {
            var customersResult = await _repo.GetAllAsync();

            if (!customersResult.IsSuccess)
            {
                return Result<IEnumerable<CustomerDTO>>.Failure(ResultCodes.ServerError, 500);
            }

            if (customersResult.Data == null || !customersResult.Data.Any())
            {
                return Result<IEnumerable<CustomerDTO>>.Success(null, ResultCodes.CustomersNotFound);
            }

            var result = new List<CustomerDTO>();

            foreach (var item in customersResult.Data)
            {
                var newItem = item.ToDTO();
                result.Add(newItem);
            }

            return Result<IEnumerable<CustomerDTO>>.Success(result);
        }

        public async Task<Result<PagedResult<CustomerDTO>>> GetFilteredAsync(CustomerFilterDTO filter)
        {

            var predicate = BuildFilterExpression(filter);
            var orderBy = BuildOrderByExpression(filter);

            var getPagedResult = await _repo.GetPagedAsync(
                filter: predicate,
                orderBy: orderBy,
                pageNumber: filter.PageNumber,
                pageSize: filter.PageSize
               );

            if (!getPagedResult.IsSuccess)
            {
                return Result<PagedResult<CustomerDTO>>.Failure(ResultCodes.ServerError, 500);
            }

            if (getPagedResult.Data == null || !getPagedResult.Data.Items.Any())
            {
                return Result<PagedResult<CustomerDTO>>.Success(null, ResultCodes.CustomersNotFound);
            }

            var result = new PagedResult<CustomerDTO>()
            {
                Items = getPagedResult.Data.Items.Select(p =>
                {
                    var dto = p.ToDTO();
                    return dto;
                }).ToList(),

                Total = getPagedResult.Data.Total,
                PageSize = getPagedResult.Data.PageSize,
                PageNumber = getPagedResult.Data.PageNumber,
            };

            return Result<PagedResult<CustomerDTO>>.Success(result);


        }

        public async Task<Result<IEnumerable<CustomerDropdownDTO>>> GetDropdownAsync(CustomerDropdownRequestDTO dto)
        {
            var result = await _repo.GetDropdownAsync(dto.Search);

            if (!result.IsSuccess)
            {
                return Result<IEnumerable<CustomerDropdownDTO>>
                    .Failure(ResultCodes.ServerError, 500);
            }

            if (result.Data == null || !result.Data.Any())
            {
                return Result<IEnumerable<CustomerDropdownDTO>>
                    .Success(null, ResultCodes.CustomersNotFound);
            }

            var mapped = result.Data.Select(p => new CustomerDropdownDTO
            {
                Id = p.Id,
                FirstName = p.FirstName,
                LastName = p.LastName,
                Phone = p.Phone,
            }).ToList();

            return Result<IEnumerable<CustomerDropdownDTO>>.Success(mapped);
        }

        #endregion

        #region Update
        public async Task<Result<CustomerDTO>> UpdateAsync(int id, CustomerDTO dto)
        {
            var existingResult = await _repo.FindByAsync(c => c.Id == id);
            if (!existingResult.IsSuccess || existingResult.Data == null)
            {
                return Result<CustomerDTO>.Failure(
                    ResultCodes.CustomerNotFound,
                    404,
                    "Customer not found");
            }

            var entity = existingResult.Data;

            entity.UpdateFromDTO(dto);

            var updateResult = await _repo.UpdateAndSaveAsync(existingResult.Data);

            if (!updateResult.IsSuccess)
            {
                return Result<CustomerDTO>.Failure(updateResult.Code, 500);
            }

            var result = updateResult.Data?.ToDTO();

            return Result<CustomerDTO>.Success(result);

        }
        #endregion

        #region Delete
        public async Task<Result<bool>> DeleteAsync(int id)
        {
            var findResult = await GetByIdAsync(id);
            if (!findResult.IsSuccess)
            {
                return Result<bool>.Failure(
                    ResultCodes.CustomerNotFound,
                    404);
            }

            return await _repo.DeleteAndSaveAsync(id);
        }
        #endregion


        #region Private Helpers

        private Expression<Func<Customer, bool>> BuildFilterExpression(CustomerFilterDTO filter)
        {
            return p =>
                (
                    string.IsNullOrEmpty(filter.Search) ||
                    p.FirstName.Contains(filter.Search) ||
                    p.LastName.Contains(filter.Search) ||
                    p.Phone.Contains(filter.Search)
                );
        }

        private Func<IQueryable<Customer>, IOrderedQueryable<Customer>> BuildOrderByExpression(CustomerFilterDTO filter)
        {
            return filter.SortBy switch
            {
                CustomerSortBy.Newest => q => q.OrderByDescending(p => p.Id),
                CustomerSortBy.Oldest => q => q.OrderBy(p => p.Id),
                CustomerSortBy.PhoneDesc => q => q.OrderByDescending(p => p.Phone),
                CustomerSortBy.PhoneAsc => q => q.OrderBy(p => p.Phone),
                CustomerSortBy.FirstNameDesc => q => q.OrderByDescending(p => p.FirstName),
                CustomerSortBy.FirstNameAsc => q => q.OrderBy(p => p.FirstName),
                CustomerSortBy.LastNameDesc => q => q.OrderByDescending(p => p.LastName),
                CustomerSortBy.LastNameAsc => q => q.OrderBy(p => p.LastName),
                _ => q => q.OrderByDescending(p => p.Id)
            };
        }

        #endregion

    }
}
