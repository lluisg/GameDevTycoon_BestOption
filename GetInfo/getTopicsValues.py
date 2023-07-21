import json
from list_topics import topics
from list_genres import genres
from list_audiences import audiences

def create_system_json():
  data = {}
  for topics_name in topics:
      data[topics_name] = {}

  for topics_name in topics:
    print('---'+topics_name+'---')
    print('Genres:')
    data[topics_name]['Genres'] = {}
    for genre_name in genres:
      genre_value = input(f"{genre_name}:")
      data[topics_name]['Genres'][genre_name] = genre_value

    print('Audiences:')
    data[topics_name]['Audiences'] = {}
    for audience_name in audiences:
      audience_value = input(f"{audience_name}:")
      data[topics_name]['Audiences'][audience_name] = audience_value

  
  filename = "values_data.json"
  with open(filename, "w") as json_file:
    json.dump(data, json_file, indent=4)

  print(f"JSON file '{filename}' created successfully.")

if __name__ == "__main__":
    create_system_json()
