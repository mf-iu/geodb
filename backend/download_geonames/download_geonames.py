import os
import pathlib
import re
import requests
import zipfile

from bs4 import BeautifulSoup
from urllib.parse import urljoin

# URL to the GeoNames dump folder
base_url = "https://download.geonames.org/export/dump/"

# Folder where you want to save the files
download_folder = "txt"

# Regular expression for two-letter country codes
country_code_pattern = re.compile(r'^[A-Z]{2}\.zip$')

# Exclude patterns
exclude_patterns = [
    "alternateNames.zip",            # Specific file name to exclude
    "no-country.zip",                # Specific file name to exclude
    "cities",                        # Exclude any file that starts with 'cities'
    "deletes-",                      # Exclude any file that starts with 'deletes-'
    "modifications-",                # Exclude any file that starts with 'modifications-'
    "alternateNamesDeletes-",        # Exclude any file that starts with 'alternateNamesDeletes-'
    "alternateNamesModifications-"   # Exclude any file that starts with 'alternateNamesModifications-'
]

# Function to download a single file
def download_file(file_url, download_folder):
    local_filename = os.path.join(download_folder, os.path.basename(file_url))
    with requests.get(file_url, stream=True) as response:
        response.raise_for_status()
        with open(local_filename, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
    print(f"Downloaded: {local_filename}")
    return local_filename

# Function to extract zip file and delete it
def unzip_and_delete(zip_filepath):
    # Extract the zip file
    with zipfile.ZipFile(zip_filepath, 'r') as zip_ref:
        zip_ref.extractall(download_folder)
        print(f"Extracted: {zip_filepath}")

    # Delete the zip file after extraction
    os.remove(zip_filepath)
    print(f"Deleted: {zip_filepath}")

# Function to get the list of files from the GeoNames dump page
def get_file_list(base_url):
    # Send a GET request to the base URL
    response = requests.get(base_url)
    response.raise_for_status()

    # Parse the page using BeautifulSoup
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find all the links in the page
    links = soup.find_all('a')

    # Extract the file names and construct full URLs
    file_urls = []
    for link in links:
        href = link.get('href')
        if not href:
            continue

        # Check if the file should be excluded
        if not href.endswith(".txt") and not href.endswith(".zip"):
            continue

        if (country_code_pattern.match(href) or
            any(href.startswith(pattern) for pattern in exclude_patterns)):
            continue

        file_urls.append(urljoin(base_url, href))

    return file_urls

def main():
    # Create the download folder if it doesn't exist
    if not os.path.exists(download_folder):
        os.makedirs(download_folder)

    # Get list of files to download
    file_urls = get_file_list(base_url)

    # Download and process each file
    for file_url in file_urls:
        zip_filepath = download_file(file_url, download_folder)

        # If the file is a .zip file, unzip it and delete the zip file
        if zip_filepath.endswith('.zip'):
            unzip_and_delete(zip_filepath)

    # Replace '-' with '_' in the file names of the extracted files
    for filename in os.listdir(download_folder):
        filename_ = filename.replace("-", "_")
        if filename_ != filename:
            os.rename(os.path.join(download_folder, filename), os.path.join(download_folder, filename_))

if __name__ == "__main__":
    main()
