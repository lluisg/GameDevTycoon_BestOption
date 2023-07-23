import json
from list_topics import topics
from list_genres import genres

def create_system_json():
  data = {}
  for topics_name in topics:
    data[topics_name] = {}
    print('---'+topics_name+'---')
    print('Genres-')
    for genre_name in genres:
      genre_value = input(f"{genre_name}:")
      data[topics_name][genre_name] = genre_value
  
  filename = "values_topics_genres.json"
  with open(filename, "w") as json_file:
    json.dump(data, json_file, indent=4)

  print(f"JSON file '{filename}' created successfully.")

if __name__ == "__main__":
    create_system_json()
