using System.Text.Json;

namespace API.RequestHelpers
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, MetaData metadata)
        {
            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            response.Headers.Append("Pagination", JsonSerializer.Serialize(metadata, options));
            response.Headers.Append("Access-Control-Expose-Headers", "Pagination"); //This is a must for allowing our clients to reade the Pagination Header
        }
    }
}