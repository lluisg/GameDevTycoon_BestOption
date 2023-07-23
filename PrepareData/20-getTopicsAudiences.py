import json
from list_topics import topics
from list_audiences import audiences

def create_system_json():
  data = {}
  for topics_name in topics:
    data[topics_name] = {}
    print('---'+topics_name+'---')
    print('Audiences-')
    for audience_name in audiences:
      audience_value = input(f"{audience_name}:")
      data[topics_name][audience_name] = audience_value
  
  filename = "values_topics_audiences.json"
  with open(filename, "w") as json_file:
    json.dump(data, json_file, indent=4)

  print(f"JSON file '{filename}' created successfully.")

if __name__ == "__main__":
    create_system_json()
