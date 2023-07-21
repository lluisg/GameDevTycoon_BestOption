import json
from list_stages import stages
from list_genres import genres

def create_system_json():
  data = {}
  for ind1, genre_name1 in enumerate(genres):
    for ind2, genre_name2 in enumerate(genres):
      if ind1 != ind2:
        genre_full = genre_name1 + '/' + genre_name2
        data[genre_full] = {}
        print('---'+genre_full+'---')
        for stage_num in stages.keys():
          data[genre_full][stage_num] = {}
          for stage in stages[stage_num]:
            stage_value = input(f"{stage_num}-{stage}:")
            data[genre_full][stage_num][stage] = stage_value

  filename = "values_multigenre.json"
  with open(filename, "w") as json_file:
    json.dump(data, json_file, indent=4)

  print(f"JSON file '{filename}' created successfully.")

if __name__ == "__main__":
    create_system_json()
