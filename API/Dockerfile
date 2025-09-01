FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-env
WORKDIR /app

# copy csproj and restore as distinct layers
COPY *.csproj ./
# dotnet restore downloads and restores all the packages included in the csproj file
RUN dotnet restore 

#copy everything else and build
COPY . ./
#output on the /app/out folder
RUN dotnet publish -c Release -o out

#build a runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build-env /app/out .
#API is out project name
ENV ASPNETCORE_URLS=http://+:80
ENTRYPOINT ["dotnet", "API.dll"]