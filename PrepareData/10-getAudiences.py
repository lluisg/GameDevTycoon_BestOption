def update_python_file(topics_list):
  with open("list_audiences.py", "w") as file:
    file.write("audiences = [\n")
    for topic in topics_list:
        words = topic.split(' ')
        words_cap = [word.capitalize() for word in words]
        cap_topic = (' ').join(words_cap)
        file.write(f"    '{cap_topic}',\n")
    file.write("]\n")

def main():
    topics = []

    while True:
        topic = input("Enter a audiences (or 'exit' to finish): ")
        if topic.lower() == "exit":
            break

        topics.append(topic)

    update_python_file(topics)
    print("Audiences have been updated in the 'list_audiences.py' file.")

if __name__ == "__main__":
    main()