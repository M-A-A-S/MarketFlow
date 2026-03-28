namespace MarketFlow.Utilities
{
    public class Result<T>
    {
        public bool IsSuccess { get; private set; }
        public string Code { get; private set; }
        public int StatusCode { get; private set; }
        public T? Data { get; private set; }
        public string? Message { get; private set; }

        private Result(bool isSuccess, string code, int statusCode, T? data, string? message = null)
        {
            IsSuccess = isSuccess;
            Code = code;
            StatusCode = statusCode;
            Data = data;
            Message = message;
        }

        public static Result<T> Success(T? data, string code = "success", int statusCode = 200)
        {
            return new Result<T>(true, code, statusCode, data);
        }

        public static Result<T> Failure(string code = "failure", int statusCode = 400, string? message = null)
        {
            return new Result<T>(false, code, statusCode, default, message);
        }
    }
}
