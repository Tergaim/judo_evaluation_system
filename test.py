l = 7
state = [[0]*l]
while l>1:
    l = int(l/2) + (l&1)
    state.append([0]*l)
print(state)