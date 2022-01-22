import random

def swap(scene, first_inds, second_inds):
  new_scene = [s.copy() for s in scene]
  new_scene[first_inds[0]][first_inds[1]], new_scene[second_inds[0]][second_inds[1]] = new_scene[second_inds[0]][second_inds[1]], new_scene[first_inds[0]][first_inds[1]]
  return new_scene

def check(scene):
  locs = {i: [x, y] for y, row in enumerate(scene) for x, i in enumerate(row)}
  return all(locs[i] == [i % len(scene[0]), i // len(scene)] for i in locs) 

def tuplify(scene):
  return tuple(tuple(s) for s in scene)

def gen_random(d=3, num_moves=100, seed=0):
  r = random.Random(seed)
  N = d * d
  state = list(range(N))        
  for _ in range(num_moves):
      blank = state.index(0)
      delta = r.choice([-1, 1, d, -d])

      i = blank + delta
      if i not in range(N) or delta == 1 and i % d == 0 or delta == -1 and blank % d == 0:
          continue

      state[i], state[blank] = state[blank], state[i]
  return [list(state[i:i + d]) for i in range(0, N, d)]

start_scene = gen_random(d=4, num_moves=60, seed=3)

def h(scene):
  locs = {i: [x, y] for y, row in enumerate(scene) for x, i in enumerate(row)}
  return sum(locs[i] != [i % len(scene[0]), i // len(scene)] for i in locs if i != 0)

def ans2(start_scene):
  scene_tree = [start_scene]
  level = 0
  
  print('start scene:', start_scene, level)
  seen = {}
  distance = {tuplify(start_scene): 0}

  def helper(a, b, dist):
    scene2 = swap(scene, a, b)
    t = tuplify(scene2)
    if t not in seen:
      next_level.append(scene2)
      seen[t] = scene
    if t in distance:
      distance[t] = min(distance[t], dist + 1)
    else:
      distance[t] = dist + 1
  
  while True:
    # Checks if answer is in tree already
    for scene in scene_tree:      
      if check(scene):
        result = []
        while scene != start_scene:
          result.append(scene)
          scene = seen[tuplify(scene)]
        return level-1, result

    while True:
      next_level = []  
      for scene in scene_tree:
          dist = distance[tuplify(scene)]
          
          if dist + h(scene) > level:
            continue 
          
          # Locating zero      
          for y, row in enumerate(scene):
            for x in range(len(row)):
              if scene[y][x] == 0:
                zero_x = x
                zero_y = y
          # Adding availablilties to tree
          if zero_x > 0:
            helper([zero_y, zero_x], [zero_y, zero_x - 1], dist)
          if zero_y > 0:
            helper([zero_y, zero_x], [zero_y - 1, zero_x], dist)
          if zero_x < len(scene[0])-1:
            helper([zero_y, zero_x], [zero_y, zero_x + 1], dist)
          if zero_y < len(scene[0])-1:
            helper([zero_y, zero_x], [zero_y + 1, zero_x], dist)
        # if not next_level:
        #   return "NO SOLUTION, IMPOSSIBLE!"
      scene_tree += next_level   
      if next_level == []:
        break
    level += 1
ans2(start_scene)
