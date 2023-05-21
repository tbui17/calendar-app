import requests

TEST1 = "http://localhost:3000/api/hello"
TEST2 = "http://localhost:3000/api/getData"

dat = requests.post(TEST2,json={"dat":"dat123"})
print(dat.json())


