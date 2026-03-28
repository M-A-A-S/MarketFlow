namespace MarketFlow.Utilities
{
    public static class ImageUrlHelper
    {
        private static string? _defaultBaseUrl;

        public static void Configure(string? baseUrl)
        {
            _defaultBaseUrl = baseUrl;
        }

        public static string? ToAbsoluteUrl(string? relativeUrl, string? baseUrl = null)
        {
            if (string.IsNullOrWhiteSpace(relativeUrl))
            {
                return null;
            }

            if (Uri.TryCreate(relativeUrl, UriKind.Absolute, out _))
            {
                return relativeUrl;
            }

            var finalBaseUrl = baseUrl ?? _defaultBaseUrl;

            if (string.IsNullOrWhiteSpace(finalBaseUrl))
            {
                throw new InvalidOperationException("BaseUrl not configured for ImageUrlHelper");
            }

            var baseUri = new Uri(finalBaseUrl.TrimEnd('/') + "/");
            var fullUri = new Uri(baseUri, $"Uploads/{relativeUrl.TrimStart('/')}");

            return fullUri.ToString();
        }
    }
}
