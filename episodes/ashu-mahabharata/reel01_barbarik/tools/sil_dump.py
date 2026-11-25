import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import vo_prep as V
for n in sys.argv[1:]:
    x = V.load(n); db, h = V.rms_db(x)
    print("==", n, round(len(x)/V.SR,2))
    for a, b in V.silences(db, h, min_len=0.12): print(f"{a:6.2f}-{b:6.2f}  {b-a:.2f}")
