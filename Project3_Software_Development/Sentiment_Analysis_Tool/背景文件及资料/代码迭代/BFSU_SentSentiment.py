"""
Sentiment Analysis GUI Program
==============================
A Python program with Tkinter GUI for analyzing and visualizing sentiment in text files,
and listing the top ten positive and top ten negative words contributing to each text's sentiment.

Required packages installation:
------------------------------
pip install nltk matplotlib numpy

For creating executable:
------------------------
pip install pyinstaller

To create executable:
pyinstaller --onefile --windowed --add-data "nltk_data;nltk_data" BFSU_SentSentiment.py

Note: Before first run, download NLTK data:
import nltk
nltk.download('vader_lexicon')
nltk.download('punkt')
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from matplotlib.figure import Figure
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.tokenize import sent_tokenize, word_tokenize
import os
import numpy as np
nltk.download('vader_lexicon')
nltk.download('punkt')

def download_nltk_data():
    """Download required NLTK data files if not already present."""
    try:
        nltk.data.find('sentiment/vader_lexicon')
    except LookupError:
        print("Downloading VADER lexicon...")
        nltk.download('vader_lexicon')
    try:
        nltk.data.find('tokenizers/punkt')
    except LookupError:
        print("Downloading punkt tokenizer...")
        nltk.download('punkt')

# Call this at startup
download_nltk_data()

class SentimentAnalyzerGUI:
    """Main GUI class for the Sentiment Analysis application."""
    
    def __init__(self, root):
        self.root = root
        self.root.title("BFSU_SentSentiment")
        self.root.geometry("1000x700")
        
        # Initialize sentiment analyzer
        self.sia = SentimentIntensityAnalyzer()
        
        # Storage for loaded files, analysis results, and top-word contributions
        self.loaded_files = {}         # {filename: content}
        self.analysis_results = {}     # {filename: [(sentence, score), ...]}
        self.top_words = {}            # {filename: {'positive': [(w,sc)...], 'negative': [...]}}
        
        # Setup GUI components
        self.setup_gui()
        
    def setup_gui(self):
        """Create and arrange all GUI components."""
        
        # Main container
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Configure grid weights for resizing
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(0, weight=1)
        main_frame.rowconfigure(2, weight=1)
        
        # Control Panel
        control_frame = ttk.LabelFrame(main_frame, text="Control Panel", padding="10")
        control_frame.grid(row=0, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        
        # Upload button
        self.upload_btn = ttk.Button(
            control_frame, 
            text="Upload Text Files", 
            command=self.upload_files
        )
        self.upload_btn.grid(row=0, column=0, padx=5)
        
        # Analyze button
        self.analyze_btn = ttk.Button(
            control_frame, 
            text="Analyze Sentiment", 
            command=self.analyze_sentiment,
            state=tk.DISABLED
        )
        self.analyze_btn.grid(row=0, column=1, padx=5)
        
        # Clear button
        self.clear_btn = ttk.Button(
            control_frame, 
            text="Clear All", 
            command=self.clear_all
        )
        self.clear_btn.grid(row=0, column=2, padx=5)

        # Top Contributing Words button
        self.top_words_btn = ttk.Button(
            control_frame,
            text="Top Contributing Words",
            command=self.show_top_words,
            state=tk.DISABLED
        )
        self.top_words_btn.grid(row=0, column=3, padx=5)
        
        # --- 新增：Save Graph按钮 ---
        self.save_btn = ttk.Button(
            control_frame,
            text="Save Graph",
            command=self.save_figure,
            state=tk.DISABLED      # 初始禁止
        )
        self.save_btn.grid(row=0, column=4, padx=5)
        # --- 新增结束 ---

        # File List Frame
        file_frame = ttk.LabelFrame(main_frame, text="Loaded Files", padding="10")
        file_frame.grid(row=1, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        
        # Listbox for files with scrollbar
        list_frame = ttk.Frame(file_frame)
        list_frame.pack(fill=tk.BOTH, expand=True)
        
        scrollbar = ttk.Scrollbar(list_frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        self.file_listbox = tk.Listbox(
            list_frame, 
            height=5, 
            yscrollcommand=scrollbar.set,
            selectmode=tk.EXTENDED
        )
        self.file_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.config(command=self.file_listbox.yview)
        
        # Visualization Frame
        viz_frame = ttk.LabelFrame(main_frame, text="Sentiment Visualization", padding="10")
        viz_frame.grid(row=2, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        viz_frame.columnconfigure(0, weight=1)
        viz_frame.rowconfigure(0, weight=1)
        
        # Create matplotlib figure
        self.figure = Figure(figsize=(10, 6), dpi=100)
        self.ax = self.figure.add_subplot(111)
        self.ax.set_xlabel('Sentence Number')
        self.ax.set_ylabel('Sentiment Score')
        self.ax.set_title('Sentiment Analysis Results')
        self.ax.grid(True, alpha=0.3)
        
        # Embed matplotlib in tkinter
        self.canvas = FigureCanvasTkAgg(self.figure, viz_frame)
        self.canvas.get_tk_widget().grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Status bar
        self.status_var = tk.StringVar()
        self.status_var.set("Ready to load files...")
        status_bar = ttk.Label(main_frame, textvariable=self.status_var, relief=tk.SUNKEN)
        status_bar.grid(row=3, column=0, sticky=(tk.W, tk.E), pady=(10, 0))
        
    def upload_files(self):
        """Handle file upload dialog and load selected files."""
        filenames = filedialog.askopenfilenames(
            title="Select text files",
            filetypes=[("Text files", "*.txt"), ("All files", "*.*")]
        )
        
        if filenames:
            for filepath in filenames:
                try:
                    with open(filepath, 'r', encoding='utf-8') as file:
                        content = file.read()
                except Exception:
                    # Fallback to latin-1 on decode error
                    with open(filepath, 'r', encoding='latin-1') as file:
                        content = file.read()
                filename = os.path.basename(filepath)
                self.loaded_files[filename] = content
                if filename not in self.file_listbox.get(0, tk.END):
                    self.file_listbox.insert(tk.END, filename)
            
            if self.loaded_files:
                self.analyze_btn.config(state=tk.NORMAL)
                self.status_var.set(f"Loaded {len(self.loaded_files)} file(s)")
                
    def analyze_sentiment(self):
        """Perform sentiment analysis on all loaded files and compute top words."""
        if not self.loaded_files:
            messagebox.showwarning("No Files", "Please upload text files first.")
            return
        
        self.status_var.set("Analyzing sentiment...")
        self.analysis_results.clear()
        self.top_words.clear()
        
        for filename, content in self.loaded_files.items():
            # Sentence tokenization & analysis
            sentences = sent_tokenize(content)
            results = []
            for sentence in sentences:
                score = self.sia.polarity_scores(sentence)['compound']
                results.append((sentence, score))
            self.analysis_results[filename] = results
            
            # Word-level contributions
            contrib = {}
            tokens = word_tokenize(content)
            for tok in tokens:
                w = tok.lower()
                if w in self.sia.lexicon:
                    contrib[w] = contrib.get(w, 0.0) + self.sia.lexicon[w]
            # Top 10 positive & negative
            pos = sorted([(w, sc) for w, sc in contrib.items() if sc > 0],
                         key=lambda x: x[1], reverse=True)[:10]
            neg = sorted([(w, sc) for w, sc in contrib.items() if sc < 0],
                         key=lambda x: x[1])[:10]
            self.top_words[filename] = {'positive': pos, 'negative': neg}
        
        # Visualize results and enable Top Words & Save Graph buttons
        self.visualize_results()
        self.top_words_btn.config(state=tk.NORMAL)
        self.save_btn.config(state=tk.NORMAL)      # 使保存按钮可用
        self.status_var.set("Analysis complete!")
        
    def visualize_results(self):
        """Create line plots for sentiment analysis results."""
        self.ax.clear()
        colors = plt.cm.tab10(np.linspace(0, 1, 10))
        
        for idx, (filename, results) in enumerate(self.analysis_results.items()):
            if results:
                x = list(range(1, len(results) + 1))
                y = [score for _, score in results]
                self.ax.plot(x, y,
                             marker='o', markersize=4,
                             label=filename if len(filename)<=30 else filename[:30]+'...',
                             color=colors[idx % len(colors)], linewidth=2, alpha=0.8)
        
        self.ax.set_xlabel('Sentence Number', fontsize=12)
        self.ax.set_ylabel('Sentiment Score', fontsize=12)
        self.ax.set_title('Sentiment Analysis Results', fontsize=14, fontweight='bold')
        self.ax.grid(True, alpha=0.3)
        self.ax.set_ylim(-1.1, 1.1)
        self.ax.axhline(0, color='black', linestyle='--', alpha=0.5)
        if self.analysis_results:
            self.ax.legend(loc='best', framealpha=0.9)
        self.canvas.draw()
        
    def show_top_words(self):
        """Display a popup listing top ten positive and negative words per file."""
        popup = tk.Toplevel(self.root)
        popup.title("Top Contributing Words")
        txt = tk.Text(popup, wrap='word', width=60, height=20)
        txt.pack(side='left', fill='both', expand=True)
        sb = ttk.Scrollbar(popup, command=txt.yview)
        sb.pack(side='right', fill='y')
        txt.config(yscrollcommand=sb.set)
        
        for name, lists in self.top_words.items():
            txt.insert('end', f"{name}:\n")
            txt.insert('end', "  Top 10 Positive Words:\n")
            for w, sc in lists['positive']:
                txt.insert('end', f"    {w}: {sc:.3f}\n")
            txt.insert('end', "  Top 10 Negative Words:\n")
            for w, sc in lists['negative']:
                txt.insert('end', f"    {w}: {sc:.3f}\n")
            txt.insert('end', "\n")
        txt.config(state='disabled')
        
    def save_figure(self):
        """Save the current figure as a PNG image."""
        filetypes = [("PNG File", "*.png"), ("All Files", "*.*")]
        filepath = filedialog.asksaveasfilename(
            defaultextension=".png",
            filetypes=filetypes,
            title="Save Graph As..."
        )
        if filepath:
            try:
                self.figure.savefig(filepath)
                messagebox.showinfo("Success", f"Graph saved to:\n{filepath}")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to save graph:\n{e}")

    def clear_all(self):
        """Clear all loaded files and results."""
        self.loaded_files.clear()
        self.analysis_results.clear()
        self.top_words.clear()
        self.file_listbox.delete(0, tk.END)
        self.ax.clear()
        self.ax.set_xlabel('Sentence Number')
        self.ax.set_ylabel('Sentiment Score')
        self.ax.set_title('Sentiment Analysis Results')
        self.ax.grid(True, alpha=0.3)
        self.canvas.draw()
        self.analyze_btn.config(state=tk.DISABLED)
        self.top_words_btn.config(state=tk.DISABLED)
        self.save_btn.config(state=tk.DISABLED)       # 清空后禁用保存
        self.status_var.set("Ready to load files...")

def main():
    """Main function to run the application."""
    root = tk.Tk()
    app = SentimentAnalyzerGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()