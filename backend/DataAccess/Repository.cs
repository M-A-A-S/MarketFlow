using MarketFlow.Entities;
using MarketFlow.Utilities;
using MarketFlow.Utilities.ResultCodes;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace MarketFlow.DataAccess
{
    public abstract class Repository<T> : IRepository<T> where T : BaseEntity
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbSet;
        protected readonly ILogger<T> _logger;

        protected Repository(AppDbContext context, ILogger<T> logger)
        {
            _context = context;
            _dbSet = context.Set<T>();
            _logger = logger;
        }

        #region Add Methods
        public virtual async Task<Result<T>> AddAsync(T entity)
        {
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;
            await _dbSet.AddAsync(entity);
            return Result<T>.Success(entity);
        }

        public virtual async Task<Result<T>> AddAndSaveAsync(T entity)
        {
            try
            {
                var addResult = await AddAsync(entity);
                await _context.SaveChangesAsync();
                return Result<T>.Success(entity);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database update failed while adding entity.");
                return Result<T>.Failure(ResultCodes.DbError, 500, "Database error");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while adding entity.");
                return Result<T>.Failure(ResultCodes.ServerError, 500, "Server error");
            }
        }

        public virtual async Task<Result<bool>> AddRangeAsync(IEnumerable<T> entities)
        {
            if (entities == null || !entities.Any())
                return Result<bool>.Success(true);

            try
            {
                foreach (var entity in entities)
                {
                    entity.CreatedAt = DateTime.UtcNow;
                    entity.UpdatedAt = DateTime.UtcNow;
                }

                await _dbSet.AddRangeAsync(entities);
                return Result<bool>.Success(true);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database update failed while adding range of entities.");
                return Result<bool>.Failure(ResultCodes.DbError, 500, "Database error");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while adding range of entities.");
                return Result<bool>.Failure(ResultCodes.ServerError, 500, "Server error");
            }
        }

        public virtual async Task<Result<bool>> AddRangeAndSaveAsync(IEnumerable<T> entities)
        {
            var addResult = await AddRangeAsync(entities);
            if (!addResult.IsSuccess) return addResult;

            try
            {
                await _context.SaveChangesAsync();
                return Result<bool>.Success(true);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database update failed while saving added range.");
                return Result<bool>.Failure(ResultCodes.DbError, 500, "Database error");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while saving added range.");
                return Result<bool>.Failure(ResultCodes.ServerError, 500, "Server error");
            }
        }

        #endregion

        #region Delete Methods

        public virtual async Task<Result<bool>> DeleteAsync(T entity)
        {
            entity.IsDeleted = true;
            entity.DeletedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;
            _dbSet.Update(entity);
            return Result<bool>.Success(true);
        }

        public virtual async Task<Result<bool>> DeleteAndSaveAsync(T entity)
        {
            try
            {
                var deleteResult = await DeleteAsync(entity);
                await _context.SaveChangesAsync();
                return Result<bool>.Success(true);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database update failed while deleting entity.");
                return Result<bool>.Failure(ResultCodes.DbError, 500, "Database error");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while deleting entity.");
                return Result<bool>.Failure(ResultCodes.ServerError, 500, "Server error");
            }
        }

        public virtual async Task<Result<bool>> DeleteAsync(int id)
        {

            var entity = await _dbSet.FindAsync(id);
            if (entity == null)
            {
                return Result<bool>.Failure(ResultCodes.NotFound, 400, "Entity not found");
            }
            entity.IsDeleted = true;
            entity.DeletedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;
            _dbSet.Update(entity);
            return Result<bool>.Success(true);
        }

        public virtual async Task<Result<bool>> DeleteAndSaveAsync(int id)
        {
            try
            {
                var deleteResult = await DeleteAsync(id);
                if (!deleteResult.IsSuccess)
                {
                    return Result<bool>.Failure(deleteResult.Code);
                }
                await _context.SaveChangesAsync();
                return Result<bool>.Success(true);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database update failed while deleting entity.");
                return Result<bool>.Failure(ResultCodes.DbError, 500, "Database error");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while deleting entity.");
                return Result<bool>.Failure(ResultCodes.ServerError, 500, "Server error");
            }
        }
        public virtual async Task<Result<bool>> DeleteRangeAsync(IEnumerable<T> entities)
        {
            if (entities == null || !entities.Any())
                return Result<bool>.Success(true); // Nothing to remove

            try
            {
                foreach (var entity in entities)
                {
                    entity.IsDeleted = true;
                    entity.DeletedAt = DateTime.UtcNow;
                    entity.UpdatedAt = DateTime.UtcNow;
                }
                _dbSet.UpdateRange(entities);
                return Result<bool>.Success(true);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database update failed while removing range of entities.");
                return Result<bool>.Failure(ResultCodes.DbError, 500, "Database error");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while removing range of entities.");
                return Result<bool>.Failure(ResultCodes.ServerError, 500, "Server error");
            }
        }

        public virtual async Task<Result<bool>> DeleteRangeAndSaveAsync(IEnumerable<T> entities)
        {
            var removeResult = await DeleteRangeAsync(entities);
            if (!removeResult.IsSuccess) return removeResult;

            try
            {
                await _context.SaveChangesAsync();
                return Result<bool>.Success(true);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database update failed while saving removed range.");
                return Result<bool>.Failure(ResultCodes.DbError, 500, "Database error");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while saving removed range.");
                return Result<bool>.Failure(ResultCodes.ServerError, 500, "Server error");
            }
        }

        #endregion


        #region Update Methods

        public virtual async Task<Result<T>> UpdateAsync(T entity)
        {
            entity.UpdatedAt = DateTime.UtcNow;
            _dbSet.Update(entity);
            return Result<T>.Success(entity);
        }

        public virtual async Task<Result<T>> UpdateAndSaveAsync(T entity)
        {
            try
            {
                var updateResult = await UpdateAsync(entity);
                await _context.SaveChangesAsync();
                return Result<T>.Success(entity);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database update failed while updating entity.");
                return Result<T>.Failure(ResultCodes.DbError, 500, "Database error");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while updating entity.");
                return Result<T>.Failure(ResultCodes.ServerError, 500, "Server error");
            }
        }

        #endregion


        #region Query Methods

        public virtual async Task<Result<IEnumerable<T>>> GetAllAsync(
Expression<Func<T, bool>> predicate = null,
Func<IQueryable<T>, IQueryable<T>>? include = null)
        {
            try
            {
                IQueryable<T> query = _dbSet.AsNoTracking().AsSplitQuery();

                if (include != null)
                {
                    query = include(query);
                }

                if (predicate != null)
                {
                    query = query.Where(predicate);
                }

                var data = await query.ToListAsync();

                return Result<IEnumerable<T>>.Success(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving all entities.");
                return Result<IEnumerable<T>>.Failure(ResultCodes.ServerError, 500, "Server error");
            }
        }

        public virtual async Task<Result<T>> FindByAsync(
Expression<Func<T, bool>> predicate,
Func<IQueryable<T>, IQueryable<T>>? include = null)
        {
            try
            {
                IQueryable<T> query = _dbSet.AsNoTracking().AsSplitQuery();

                if (include != null)
                {
                    query = include(query);
                }

                var entity = await query.FirstOrDefaultAsync(predicate);

                if (entity == null)
                {
                    return Result<T>.Failure(ResultCodes.NotFound);
                }

                return Result<T>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving entity.");
                return Result<T>.Failure(ResultCodes.ServerError, 500, "Server error");
            }
        }

        public virtual async Task<Result<PagedResult<T>>> GetPagedAsync(
Expression<Func<T, bool>>? filter = null,
Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
int pageNumber = 1,
int pageSize = 10,
params Expression<Func<T, object>>[] includes)
        {
            try
            {
                pageNumber = pageNumber < 1 ? 1 : pageNumber;
                pageSize = pageSize < 1 ? 10 : pageSize;
                pageSize = pageSize > 100 ? 100 : pageSize;


                IQueryable<T> query = _dbSet.AsNoTracking().AsSplitQuery();

                // Includes (navigation properties
                foreach (var include in includes)
                {
                    query = query.Include(include);
                }


                // Filtering (searching)
                if (filter != null)
                {
                    query = query.Where(filter);
                }

                var total = await query.CountAsync();

                // Sorting
                if (orderBy != null)
                {
                    query = orderBy(query);
                }

                // Pagination
                var skip = (pageNumber - 1) * pageSize;

                var items = await query.Skip(skip).Take(pageSize).ToListAsync();

                var result = new PagedResult<T>
                {
                    Items = items,
                    Total = total,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                };

                return Result<PagedResult<T>>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while retrieving paged data.");
                return Result<PagedResult<T>>.Failure(ResultCodes.ServerError, 500, "Server error");
            }
        }

        #endregion

    }
}
