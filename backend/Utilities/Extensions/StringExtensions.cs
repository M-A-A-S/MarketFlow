namespace MarketFlow.Utilities.Extensions
{
    public static class StringExtensions
    {
        public static bool IsValidImageUrl(this string url)
        {
            return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
                && (uriResult.Scheme == Uri.UriSchemeHttp
                    || uriResult.Scheme == Uri.UriSchemeHttps);
        }
    }
}
