import os
import pandas as pd
import re
import emoji
import unicodedata

# Define file paths
input_txt = 'input3.txt'
cleaned_txt = 'input3_cleaned.txt'

# URLs for the two CSV files
url1 = 'https://raw.githubusercontent.com/MarkHershey/CompleteTrumpTweetsArchive/master/data/realDonaldTrump_in_office.csv'
url2 = 'https://raw.githubusercontent.com/MarkHershey/CompleteTrumpTweetsArchive/master/data/realDonaldTrump_bf_office.csv'

# Function to import CSVs and save combined tweets if input3.txt does not exist
def import_csvs():
    if not os.path.exists(input_txt):
        print(f"{input_txt} not found. Downloading and combining CSVs...")
        df1 = pd.read_csv(url1, on_bad_lines='skip', low_memory=False)
        df2 = pd.read_csv(url2, on_bad_lines='skip', low_memory=False)
        tweets1 = df1[' Tweet Text'].str.strip('"')
        tweets2 = df2[' Tweet Text'].str.strip('"')
        all_tweets = pd.concat([tweets1, tweets2], ignore_index=True)
        all_tweets.to_csv(input_txt, index=False, header=False)
    else:
        print(f"{input_txt} already exists. Skipping CSV import.")

# Function to clean tweets and save to input3_cleaned.txt
def clean_tweets():
    with open(input_txt, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    def clean_tweet(text):
        text = text.replace('"', '').replace("'", '')
        text = re.sub(r'https?://\S+', '', text)
        text = emoji.replace_emoji(text, replace='')
        text = re.sub(r'@([\w_]+)', r'\1', text)
        text = re.sub(r'[^\w\s#]', '', text)
        text = text.replace('Ä', '')
        text = text.replace('_', '')
        text = unicodedata.normalize('NFD', text)
        text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
        text = re.sub(r'[^a-zA-Z0-9 #]', '', text)
        text = text.lower()
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    cleaned_lines = [clean_tweet(line) for line in lines]
    cleaned_lines = [line for line in cleaned_lines if not line.startswith('rt ')]
    # Ensure each tweet ends with a single newline
    with open(cleaned_txt, 'w', encoding='utf-8') as f:
        f.write('\n'.join(cleaned_lines) + '\n')

# Main execution
if __name__ == '__main__':
    import_csvs()
    clean_tweets()
    print(f"Cleaning complete. Output saved to {cleaned_txt}.")
