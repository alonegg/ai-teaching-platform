# 创建情感分析代码并打包成可执行文件（python）

## 来自你的消息:
I want a Python program with a graphical user interface (GUI) for analyzing the sentiment of text files.

The program should:

Use Tkinter for the GUI.
Let me upload one or more .txt files.
Analyze sentiment for each sentence in the files, and plot the sentiment scores as a line graph with matplotlib.
Show the top ten positive and top ten negative words (with their contribution scores) from each file based on VADER sentiment analysis.
Let me view the results and save the graph as a PNG.
Have buttons: Upload Text Files, Analyze Sentiment, Clear All, Top Contributing Words, and Save Graph.

## 来自智能对话-4.0-pro的消息:

Below is the Python program that meets your requirements. The program uses `Tkinter` for the GUI, `matplotlib` for plotting, and `nltk`'s VADER sentiment analysis tool for analyzing sentiment. Make sure you have the required libraries installed: `nltk`, `matplotlib`, and `tkinter`.

```python
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
        
        # Buttons
        self.upload_button = tk.Button(root, text="Upload Text Files", command=self.upload_files)
        self.upload_button.pack(pady=5)
        
        self.analyze_button = tk.Button(root, text="Analyze Sentiment", command=self.analyze_sentiment)
        self.analyze_button.pack(pady=5)
        
        self.clear_button = tk.Button(root, text="Clear All", command=self.clear_all)
        self.clear_button.pack(pady=5)
        
        self.top_words_button = tk.Button(root, text="Top Contributing Words", command=self.show_top_words)
        self.top_words_button.pack(pady=5)
        
        self.save_graph_button = tk.Button(root, text="Save Graph", command=self.save_graph)
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
            
            # Plot sentiment scores
            plt.plot(sentiment_scores, label=os.path.basename(file))
        
        plt.title("Sentiment Analysis")
        plt.xlabel("Sentence Index")
        plt.ylabel("Sentiment Score")
        plt.legend()
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
```

### Instructions to Run the Code:
1. **Install Required Libraries**:
   Ensure you have the required libraries installed. You can install them using:
   ```bash
   pip install nltk matplotlib
   ```

2. **Run the Program**:
   Save the code to a file (e.g., `sentiment_analyzer_gui.py`) and run it:
   ```bash
   python sentiment_analyzer_gui.py
   ```

3. **Use the GUI**:
   - Click "Upload Text Files" to upload `.txt` files.
   - Click "Analyze Sentiment" to perform sentiment analysis and plot the results.
   - Click "Top Contributing Words" to view the top positive and negative words.
   - Click "Save Graph" to save the sentiment plot as a PNG file.
   - Click "Clear All" to reset the application.

Let me know if you need further assistance!

## 来自你的消息:
Please modify the code so that:
1. The line graph can simutaneously show the sentence sentiments of multiple texts.
2. The buttons can be aligned in terms of width and height.

## 来自智能对话-4.0-pro的消息:

Here is the modified code with the requested changes:

1. The line graph now supports simultaneously displaying sentence sentiment scores for multiple text files.
2. The buttons are aligned with the same width and height for a more consistent appearance.

```python
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
```

### Key Changes:
1. **Simultaneous Line Graphs**:
   - The `analyze_sentiment` method now plots the sentiment scores for each text file on the same graph. Each file is represented by a different line, and the legend shows the file names.

2. **Aligned Buttons**:
   - All buttons are given the same `width` and `height` parameters for consistent alignment. The `width` is set to `20`, and the `height` is set to `2`.

### Instructions to Run:
1. Install the required libraries:
   ```bash
   pip install nltk matplotlib
   ```
2. Save the code to a file (e.g., `sentiment_analyzer_gui.py`) and run it:
   ```bash
   python sentiment_analyzer_gui.py
   ```
3. Use the GUI to upload `.txt` files, analyze sentiment, view results, and save the graph.

Let me know if you need further modifications or enhancements!

## 来自你的消息:
How can I create an executable program for the code?

## 来自智能对话-4.0-pro的消息:

To create an executable program from your Python code, you can use a tool like `PyInstaller`. This will bundle your Python script and its dependencies into a standalone executable file that can run on systems without requiring Python to be installed.

Here is a step-by-step guide to creating an executable:

---

### **Step 1: Install PyInstaller**
Make sure you have `PyInstaller` installed. You can install it via pip:

```bash
pip install pyinstaller
```

---

### **Step 2: Prepare Your Python Script**
Save your Python script (e.g., `sentiment_analyzer_gui.py`) in a dedicated folder. Ensure all your dependencies (e.g., `nltk` data files) are installed and working correctly.

For `nltk`, ensure that the `vader_lexicon` data is downloaded. You can confirm this by running the following in a Python shell:

```python
import nltk
nltk.download('vader_lexicon')
```

---

### **Step 3: Use PyInstaller to Create the Executable**
Open a terminal or command prompt, navigate to the folder containing your Python script, and run the following command:

```bash
pyinstaller --onefile --windowed sentiment_analyzer_gui.py
```

#### Explanation of the options:
- `--onefile`: Packages everything into a single executable file.
- `--windowed`: Ensures that no console window appears when the program runs (useful for GUI applications).

---

### **Step 4: Locate the Executable**
Once the process is complete, PyInstaller will create several folders in your working directory:
- `build/`: Temporary files used during the build process.
- `dist/`: Contains the final executable file.
- Other files like `.spec`: PyInstaller's configuration file for your script.

Navigate to the `dist/` folder, and you will find the executable file named `sentiment_analyzer_gui.exe` (or similar, depending on your script name).

---

### **Step 5: Test the Executable**
Double-click the `.exe` file in the `dist/` folder to test the program. It should launch the GUI and function as expected.

---

### **Step 6: Share the Executable**
You can share the `.exe` file with others. However, remember:
- The executable will contain all the necessary dependencies, so it may be large in size.
- If you use external files (e.g., `.txt` files for input), ensure that the users know how to provide them.

---

### **Optional: Customize the Executable**
You can further customize the process by using additional PyInstaller options:
- Add an icon to the executable:
  ```bash
  pyinstaller --onefile --windowed --icon=icon.ico sentiment_analyzer_gui.py
  ```
  Replace `icon.ico` with the path to your `.ico` file.
  
- Use the `.spec` file for advanced configurations. PyInstaller generates a `.spec` file during the build process, which you can edit and reuse.

---

### **Troubleshooting**
1. **Missing Libraries**:
   If the executable doesn't work due to missing libraries, ensure all dependencies are installed in your Python environment. Use `pip freeze` to check installed packages:
   ```bash
   pip freeze
   ```

2. **nltk Data Issues**:
   If the `vader_lexicon` data is missing, ensure it is downloaded. You can include the `nltk` data in your executable by specifying it in the `.spec` file or copying the `nltk_data` folder manually.

3. **Large File Size**:
   The `--onefile` option bundles everything into a single file, which can make the executable large. If you want to reduce the size, you can use the `--onedir` option instead, which creates a folder with the executable and dependencies.

---

Let me know if you encounter any issues or need further assistance!