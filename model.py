# ============================================================
# MARKET BASKET ANALYSIS
# DATA PREPROCESSING + FEATURE ENGINEERING + KMEANS MODELING
# ============================================================

from pathlib import Path
import warnings
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.decomposition import PCA

warnings.filterwarnings("ignore")

# ============================================================
# 1. PROJECT PATHS
# ============================================================

PROJECT_DIR = Path(__file__).resolve().parent
DATA_PATH = PROJECT_DIR / "Assignment-1_Data.csv"
OUTPUT_DIR = PROJECT_DIR / "processed_data"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ============================================================
# 2. LOAD DATA
# ============================================================

print("=" * 70)
print("MARKET BASKET ANALYSIS")
print("DATA PREPROCESSING + MODELING")
print("=" * 70)

df = pd.read_csv(DATA_PATH, delimiter=";", on_bad_lines="skip", engine="python")
print("\nOriginal shape:", df.shape)

# ============================================================
# 3. CLEANING
# ============================================================

df = df.drop_duplicates()
df = df.dropna(subset=["CustomerID"])

df["Itemname"] = df["Itemname"].astype(str).str.strip().str.upper()
df["Country"] = df["Country"].astype(str).str.strip().str.upper()

for col in ["Itemname", "Country"]:
    df[col] = df[col].replace(["NAN", "NONE", ""], np.nan)
    df[col] = df[col].fillna("UNKNOWN")

df["Date"] = pd.to_datetime(df["Date"], errors="coerce", dayfirst=True)

df["Quantity"] = pd.to_numeric(df["Quantity"], errors="coerce")
df["Price"] = pd.to_numeric(df["Price"], errors="coerce")

df.loc[df["Quantity"] <= 0, "Quantity"] = np.nan
df.loc[df["Price"] < 0, "Price"] = np.nan

# ============================================================
# 4. FEATURE ENGINEERING (CUSTOMER LEVEL)
# ============================================================

customer_df = df.groupby("CustomerID").agg(
    TotalTransactions=("BillNo", "nunique"),
    TotalItems=("Itemname", "count"),
    UniqueItems=("Itemname", "nunique"),
    TotalQuantity=("Quantity", "sum"),
    AverageQuantity=("Quantity", "mean"),
    TotalSpend=("Price", "sum"),
    AverageSpend=("Price", "mean"),
    FirstPurchase=("Date", "min"),
    LastPurchase=("Date", "max"),
    Country=("Country", "first")
).reset_index()

customer_df["CustomerActivityDays"] = (
    customer_df["LastPurchase"] - customer_df["FirstPurchase"]
).dt.days.clip(lower=0)

for col in customer_df.select_dtypes(include=np.number).columns:
    customer_df[col] = customer_df[col].fillna(customer_df[col].median())

customer_df["Country"] = customer_df["Country"].fillna("UNKNOWN")

# ============================================================
# 5. MODELING PREP
# ============================================================

features = [
    "TotalTransactions", "TotalItems", "UniqueItems",
    "TotalQuantity", "AverageQuantity",
    "TotalSpend", "AverageSpend",
    "CustomerActivityDays"
]

X = customer_df[features]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ============================================================
# 6. ELBOW METHOD
# ============================================================

print("\nRunning Elbow Method...")
inertia = []
K_range = range(2, 11)

for k in K_range:
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(X_scaled)
    inertia.append(km.inertia_)

plt.figure(figsize=(6,4))
plt.plot(K_range, inertia, marker="o")
plt.title("Elbow Method for Optimal K")
plt.xlabel("Number of clusters (k)")
plt.ylabel("Inertia")
plt.grid(True)
plt.show()

# ============================================================
# 7. FIT FINAL KMEANS
# ============================================================

optimal_k = 4  # <-- set manually after checking elbow plot
print(f"\nFitting KMeans with k={optimal_k}...")

kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
customer_df["Cluster"] = kmeans.fit_predict(X_scaled)

sil_score = silhouette_score(X_scaled, customer_df["Cluster"])
print(f"Silhouette Score: {sil_score:.3f}")

# ============================================================
# 8. CLUSTER VISUALIZATION (PCA 2D)
# ============================================================

pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

plt.figure(figsize=(8,6))
sns.scatterplot(x=X_pca[:,0], y=X_pca[:,1], hue=customer_df["Cluster"], palette="Set2")
plt.title("Customer Segments (PCA-reduced 2D)")
plt.xlabel("PCA Component 1")
plt.ylabel("PCA Component 2")
plt.legend(title="Cluster")
plt.show()

# ============================================================
# 9. SAVE RESULTS
# ============================================================

output_path = OUTPUT_DIR / "customer_clusters.csv"
customer_df.to_csv(output_path, index=False)

print("\nProcessed + clustered data saved to:", output_path)
print("\nDone!")