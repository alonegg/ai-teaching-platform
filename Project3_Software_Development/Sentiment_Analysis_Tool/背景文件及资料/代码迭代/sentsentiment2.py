import tkinter as tk
from tkinter import filedialog, messagebox
import os
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import matplotlib.pyplot as plt
from collections import Counter

# Ensure VADER data is downloaded
import nltk
nltk.download('vader_lexicon')

# Initialize Sentiment Analyzer
sid = SentimentIntensityAnalyzer()

class SentimentAnalyzerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Sentiment Analyzer")
        
        self.files = []
        self.sentiment_data = {}
        self.top_words = {}
        
        # Define button width and height
        button_width = 20
        button_height = 2
        
        # Buttons
        self.upload_button = tk.Button(root, text="Upload Text Files", command=self.upload_files, width=button_width, height=button_height)
        self.upload_button.pack(pady=5)
        
        self.analyze_button = tk.Button(root, text="Analyze Sentiment", command=self.analyze_sentiment, width=button_width, height=button_height)
        self.analyze_button.pack(pady=5)
        
        self.clear_button = tk.Button(root, text="Clear All", command=self.clear_all, width=button_width, height=button_height)
        self.clear_button.pack(pady=5)
        
        self.top_words_button = tk.Button(root, text="Top Contributing Words", command=self.show_top_words, width=button_width, height=button_height)
        self.top_words_button.pack(pady=5)
        
        self.save_graph_button = tk.Button(root, text="Save Graph", command=self.save_graph, width=button_width, height=button_height)
        self.save_graph_button.pack(pady=5)
        
        # Text Box for displaying results
        self.results_text = tk.Text(root, wrap=tk.WORD, height=20, width=80)
        self.results_text.pack(pady=10)
    
    def upload_files(self):
        self.files = filedialog.askopenfilenames(filetypes=[("Text files", "*.txt")])
        if self.files:
            self.results_text.insert(tk.END, f"Uploaded files:\n")
            for file in self.files:
                self.results_text.insert(tk.END, f"{file}\n")
        else:
            self.results_text.insert(tk.END, "No files uploaded.\n")
    
    def analyze_sentiment(self):
        if not self.files:
            messagebox.showwarning("No Files", "Please upload text files first.")
            return
        
        self.sentiment_data = {}
        self.top_words = {}
        
        plt.figure(figsize=(10, 6))  # Set the figure size
        
        for file in self.files:
            with open(file, 'r', encoding='utf-8') as f:
                text = f.read()
            
            sentences = text.split('.')
            sentiment_scores = []
            word_contributions = Counter()
            
            for sentence in sentences:
                if sentence.strip():
                    score = sid.polarity_scores(sentence)
                    sentiment_scores.append(score['compound'])
                    
                    # Analyze word contributions
                    words = sentence.split()
                    for word in words:
                        word_score = sid.polarity_scores(word)['compound']
                        if word_score != 0:
                            word_contributions[word] += word_score
            
            self.sentiment_data[file] = sentiment_scores
            self.top_words[file] = word_contributions.most_common()
            
            # Plot sentiment scores for each file
            plt.plot(sentiment_scores, label=os.path.basename(file))
        
        plt.title("Sentiment Analysis")
        plt.xlabel("Sentence Index")
        plt.ylabel("Sentiment Score")
        plt.legend()
        plt.grid()
        plt.tight_layout()
        plt.show()
        
        self.results_text.insert(tk.END, "Sentiment analysis completed.\n")
    
    def clear_all(self):
        self.files = []
        self.sentiment_data = {}
        self.top_words = {}
        self.results_text.delete(1.0, tk.END)
        plt.clf()
        self.results_text.insert(tk.END, "Cleared all data.\n")
    
    def show_top_words(self):
        if not self.top_words:
            messagebox.showwarning("No Analysis", "Please analyze sentiment first.")
            return
        
        self.results_text.insert(tk.END, "Top Contributing Words:\n")
        for file, words in self.top_words.items():
            self.results_text.insert(tk.END, f"\nFile: {file}\n")
            self.results_text.insert(tk.END, "Top 10 Positive Words:\n")
            positive_words = [word for word in words if word[1] > 0][:10]
            for word, score in positive_words:
                self.results_text.insert(tk.END, f"{word}: {score:.2f}\n")
            
            self.results_text.insert(tk.END, "Top 10 Negative Words:\n")
            negative_words = [word for word in words if word[1] < 0][:10]
            for word, score in negative_words:
                self.results_text.insert(tk.END, f"{word}: {score:.2f}\n")
    
    def save_graph(self):
        if not self.sentiment_data:
            messagebox.showwarning("No Analysis", "Please analyze sentiment first.")
            return
        
        save_path = filedialog.asksaveasfilename(defaultextension=".png", filetypes=[("PNG files", "*.png")])
        if save_path:
            plt.savefig(save_path)
            self.results_text.insert(tk.END, f"Graph saved as {save_path}\n")
        else:
            self.results_text.insert(tk.END, "Save operation canceled.\n")

# Create the Tkinter root window
root = tk.Tk()
app = SentimentAnalyzerApp(root)
root.mainloop()
