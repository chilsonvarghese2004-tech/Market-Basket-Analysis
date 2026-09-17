# ============================================================
# MARKET BASKET ANALYSIS
# DATA PREPROCESSING + FEATURE ENGINEERING
# ============================================================

from pathlib import Path
import warnings
import numpy as np
import pandas as pd

warnings.filterwarnings("ignore")

# ============================================================
# 1. PROJECT PATHS
# ============================================================

PROJECT_DIR = Path(__file__).resolve().parent
DATA_PATH = PROJECT_DIR / "Assignment-1_Data.csv"
OUTPUT_DIR = PROJECT_DIR / "processed_data"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ============================================================
# 2. LOAD DATA (robust with delimiter)
# ============================================================

print("=" * 70)
print("MARKET BASKET ANALYSIS")
print("DATA PREPROCESSING")
print("=" * 70)

print("\n1. Loading dataset...")

# Use semicolon delimiter
df = pd.read_csv(DATA_PATH, delimiter=";", on_bad_lines="skip", engine="python")

print("Original shape:", df.shape)
print("\nColumns:", df.columns.tolist())

# ============================================================
# 3. BASIC INFORMATION
# ============================================================

print("\n2. Dataset information")
print(df.info())
print("\nMissing values:\n", df.isnull().sum())
print("\nDuplicate rows:", df.duplicated().sum())

# ============================================================
# 4. REMOVE DUPLICATES
# ============================================================

df = df.drop_duplicates()
print("\nShape after removing duplicates:", df.shape)

# ============================================================
# 5. REMOVE ROWS WITHOUT CUSTOMER ID
# ============================================================

df = df.dropna(subset=["CustomerID"])
print("\nShape after removing missing CustomerID:", df.shape)

# ============================================================
# 6. CLEAN CATEGORICAL VARIABLES
# ============================================================

df["Itemname"] = df["Itemname"].astype(str).str.strip().str.upper()
df["Country"] = df["Country"].astype(str).str.strip().str.upper()

for col in ["Itemname", "Country"]:
    df[col] = df[col].replace(["NAN", "NONE", ""], np.nan)
    df[col] = df[col].fillna("UNKNOWN")

# ============================================================
# 7. CONVERT DATE COLUMN
# ============================================================

df["Date"] = pd.to_datetime(df["Date"], errors="coerce", dayfirst=True)

# ============================================================
# 8. CLEAN NUMERIC COLUMNS
# ============================================================

df["Quantity"] = pd.to_numeric(df["Quantity"], errors="coerce")
df["Price"] = pd.to_numeric(df["Price"], errors="coerce")

df.loc[df["Quantity"] <= 0, "Quantity"] = np.nan
df.loc[df["Price"] < 0, "Price"] = np.nan

# ============================================================
# 9. FEATURE ENGINEERING (CUSTOMER LEVEL)
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

# ============================================================
# 10. CUSTOMER ACTIVITY PERIOD
# ============================================================

customer_df["CustomerActivityDays"] = (
    customer_df["LastPurchase"] - customer_df["FirstPurchase"]
).dt.days.clip(lower=0)

# ============================================================
# 11. HANDLE MISSING VALUES
# ============================================================

for col in customer_df.select_dtypes(include=np.number).columns:
    customer_df[col] = customer_df[col].fillna(customer_df[col].median())

customer_df["Country"] = customer_df["Country"].fillna("UNKNOWN")

# ============================================================
# 12. RESET INDEX
# ============================================================

customer_df = customer_df.reset_index(drop=True)

# ============================================================
# 13. DISPLAY FINAL DATASET
# ============================================================

print("\n" + "=" * 70)
print("PREPROCESSING COMPLETED")
print("=" * 70)

print("\nOriginal transaction records:", len(df))
print("Unique customers:", len(customer_df))

print("\nFinal columns:")
print(customer_df.columns.tolist())

print("\nFinal shape:", customer_df.shape)

print("\nFirst 5 customers:")
print(customer_df.head())

# ============================================================
# 14. SAVE PROCESSED DATA
# ============================================================

output_path = OUTPUT_DIR / "customer_features.csv"
customer_df.to_csv(output_path, index=False)

print("\nProcessed data saved to:", output_path)
print("\nDone!")
