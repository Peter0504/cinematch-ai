# 🎬 CineMatch AI

CineMatch AI is an intelligent, explainable movie recommendation system built with Streamlit. It moves beyond standard "collaborative filtering" by utilizing Natural Language Processing (NLP) and Large Language Models (LLMs) to not only suggest what you should watch next, but to explain exactly *why*.

## ✨ Features

* **Curated Catalog**: Browse a rich dataset of 200 highly-rated movies, complete with metadata, descriptions, genres, and mood tags.
* **Interactive Taste Profiling**: Build a dynamic user profile in real-time by liking, disliking, or rating movies on a 1-5 star scale.
* **Explainable AI**: Every recommendation includes a dedicated explanation box detailing why the movie was chosen (e.g., shared directors, specific thematic tags, or semantic alignment).
* **Real-Time Evaluation Metrics**: Track recommendation quality on the fly with industry-standard metrics including Precision@5, NDCG, Intra-list Diversity, and Genre Coverage.
* **User Feedback Loop**: Leave thumbs-up or thumbs-down feedback on recommendations to track user satisfaction (CTR).

---

## 🧠 Three Recommendation Engines

CineMatch AI allows users to toggle between three distinct recommendation approaches from the sidebar:

1.  **Content-Based Filtering**: Uses `scikit-learn` to build a TF-IDF matrix from movie metadata (titles, descriptions, genres, directors, and tags) and calculates cosine similarity against your liked/disliked profile.
2.  **NLP Semantic Search**: Matches your natural language query (e.g., *"dark psychological thrillers with a twist"*) against the movie embeddings to find thematic matches.
3.  **LLM AI (Claude)**: Integrates with the Anthropic API to generate hyper-personalized recommendations and human-like explanations based on your specific taste profile and custom prompts.

---

## 🚀 Installation & Setup

**Prerequisites:** Python 3.8+

1.  **Clone the repository** (if applicable):
    ```bash
    git clone [https://github.com/yourusername/cinematch-ai.git](https://github.com/yourusername/cinematch-ai.git)
    cd cinematch-ai
    ```

2.  **Install required dependencies**:
    ```bash
    pip install streamlit scikit-learn numpy pandas anthropic
    ```

3.  **Run the Streamlit app**:
    ```bash
    streamlit run app.py
    ```

---

## 💡 How to Use

1.  **Build Your Profile**: Start in the **🎥 Browse Movies** tab. Use the genre/mood filters or the search bar to find movies. Click `Like`, `Pass`, or use the `Rate` slider to build your taste profile.
2.  **Choose an Engine**: Open the sidebar and select your preferred recommendation engine. 
    * *Note: If using the LLM mode, you will need to input your Anthropic API Key.*
3.  **Add Context (Optional)**: Type a description of what you are currently in the mood for in the text area.
4.  **Get Recommendations**: Click the **🚀 Get Recommendations** button in the sidebar.
5.  **Explore**: Navigate to the **🎯 Recommendations** tab to see your personalized picks and read the explanations.
6.  **Analyze**: Check the **📊 Metrics** tab to see the mathematical breakdown of how well the algorithm performed based on your profile.

---

## 🛠️ Tech Stack

* **Frontend & UI**: [Streamlit](https://streamlit.io/)
* **Data Manipulation**: [Pandas](https://pandas.pydata.org/), [NumPy](https://numpy.org/)
* **Machine Learning / NLP**: [Scikit-Learn](https://scikit-learn.org/) (TF-IDF, Cosine Similarity)
* **Generative AI**: [Anthropic API](https://www.anthropic.com/) (Claude 3.5 Sonnet)
