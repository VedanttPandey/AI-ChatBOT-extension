import google.generativeai as genai

genai.configure(api_key="AIzaSyAzt6f1KUekLw8w6a49p0z77X7GAMAZRc8")

for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(m.name)