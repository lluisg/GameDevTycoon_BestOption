import json
from list_platforms import platforms
from list_genres import genres

def create_system_json():
  data = {}
  for platform_name in platforms:
    data[platform_name] = {}
    print('---Platform: '+platform_name+'---')
    for genre_name in genres:
      audience_value = input(f"{genre_name}:")
      data[platform_name][genre_name] = audience_value

  
  filename = "values_platform_genres.json"
  with open(filename, "w") as json_file:
    json.dump(data, json_file, indent=4)

  print(f"JSON file '{filename}' created successfully.")

if __name__ == "__main__":
    create_system_json()
