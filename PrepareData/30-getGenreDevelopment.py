import json
from list_stages import stages
from list_genres import genres

def create_system_json():
  data = {}
  for genre_name in genres:
    data[genre_name] = {}
    print('---'+genre_name+'---')
    for stage in stages:
      stage_value = input(f"{stage}:")
      data[genre_name][stage] = stage_value

  filename = "values_genre_development.json"
  with open(filename, "w") as json_file:
    json.dump(data, json_file, indent=4)

  print(f"JSON file '{filename}' created successfully.")

if __name__ == "__main__":
    create_system_json()
