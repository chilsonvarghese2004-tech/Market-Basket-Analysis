# ============================================================
# MARKET BASKET ANALYSIS - CUSTOMER SEGMENTATION (No Streamlit)
# ============================================================

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score

# ============================================================
# 1. Load Dataset
# ============================================================

DATA_PATH = "Assignment-1_Data.csv"

print("=" * 70)
print("MARKET BASKET ANALYSIS")
print("CUSTOMER SEGMENTATION")
print("=" * 70)

df = pd.read_csv(DATA_PATH, delimiter=";", on_bad_lines="skip", engine="python")
print("Dataset shape:", df.shape)
print("Columns:", df.columns.tolist())

# ============================================================
# 2. Cleaning
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
# 3. Feature Engineering (Customer Level)
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

print("\nCustomer features created:")
print(customer_df.head())

# ============================================================
# 4. Modeling Prep
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
# 5. Choose Number of Clusters
# ============================================================

k = 4  # manually set, or adjust after elbow method
print(f"\nFitting KMeans with k={k}...")

kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
customer_df["Cluster"] = kmeans.fit_predict(X_scaled)

sil_score = silhouette_score(X_scaled, customer_df["Cluster"])
print(f"Silhouette Score: {sil_score:.3f}")

# ============================================================
# 6. Cluster Visualization
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
# 7. Save Results
# ============================================================

customer_df.to_csv("customer_clusters.csv", index=False)
print("\nClustered customer data saved to customer_clusters.csv")
