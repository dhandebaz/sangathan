import urllib.request
import time
import sys

url = "http://localhost:3000"
timeout = 60
start_time = time.time()

print(f"Waiting for {url} to be ready...")
while time.time() - start_time < timeout:
    try:
        response = urllib.request.urlopen(url)
        if response.getcode() == 200:
            print(f"Server is up at {url}!")
            sys.exit(0)
    except Exception as e:
        pass
    time.sleep(2)

print(f"Timeout waiting for {url}")
sys.exit(1)
