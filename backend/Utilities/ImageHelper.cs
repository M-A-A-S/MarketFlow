namespace MarketFlow.Utilities
{
    public static class ImageHelper
    {
        private static string? _defaultBaseUrl;

        public static void Configure(string? baseUrl)
        {
            _defaultBaseUrl = baseUrl;
        }

        public static bool IsMyServerUrl(string? url)
        {
            if (string.IsNullOrWhiteSpace(url) || string.IsNullOrWhiteSpace(_defaultBaseUrl))
            {
                return false;
            }

            return url!.StartsWith(_defaultBaseUrl, StringComparison.OrdinalIgnoreCase);
        }

        public static string GetFullPath(string folderName, string fileName)
        {
            if (string.IsNullOrWhiteSpace(fileName))
            {
                return null!;
            }
            return Path.Combine(folderName, fileName).Replace("\\", "/"); // relative URL for frontend
        }

        public static string? ToAbsoluteUrl(string? fileName, string folderName, string? baseUrl = null)
        {
            if (string.IsNullOrWhiteSpace(fileName))
            {
                return null;
            }

            // External URL → return as-is
            if (Uri.TryCreate(fileName, UriKind.Absolute, out _))
            {
                return fileName;
            }

            // Use configured base URL if not passed
            var finalBaseUrl = baseUrl ?? _defaultBaseUrl;
            if (string.IsNullOrWhiteSpace(finalBaseUrl))
            {
                throw new InvalidOperationException("BaseUrl not configured for ImageHelper");
            }

            var relativeUrl = GetFullPath(folderName, fileName);
            var baseUri = new Uri(finalBaseUrl.TrimEnd('/') + "/");
            var fullUri = new Uri(baseUri, $"Uploads/{relativeUrl.TrimStart('/')}");

            return fullUri.ToString();
        }

        public static string? GetFileNameToStore(string? incomingUrl)
        {
            if (string.IsNullOrWhiteSpace(incomingUrl))
                return null;

            // Local server URL → store only filename
            if (IsMyServerUrl(incomingUrl))
            {
                try
                {
                    var uri = new Uri(incomingUrl);
                    return Path.GetFileName(uri.LocalPath);
                }
                catch
                {
                    return null;
                }
            }

            // External URL → store as-is
            if (Uri.TryCreate(incomingUrl, UriKind.Absolute, out _))
                return incomingUrl;

            // Already a relative path or just a filename → store as filename
            return Path.GetFileName(incomingUrl);
        }

    }
}
