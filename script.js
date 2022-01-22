
let tableDiv = document.getElementById('table')

table = [[6, 1, 3, 7], [8, 4, 10, 2], [0, 5, 11, 15], [12, 9, 13, 14]]
let n = table.length

// let table = [[1, 2, 0], [3, 4, 5], [6, 7, 8]]

function render() {
  tableDiv.innerHTML = ''
  for (row of table) {
    let rowDiv = document.createElement('div')
    rowDiv.className = 'row'

    for (cell of row) {
      let cellDiv = document.createElement('div')
      cellDiv.className = 'cell'
      cellDiv.innerText = cell
      if (cell == 0) {
        cellDiv.style.background = 'black'
        cellDiv.style.color = 'black'
      }
      rowDiv.appendChild(cellDiv)
    }

    tableDiv.appendChild(rowDiv)
  }
    
  cells = document.getElementsByClassName('cell')

  for (cell of cells) {
    cell.onclick = (x) => {
      let number = parseInt(x.target.innerText)
      let zeroInd, numInd
      for (row in table) {
        for (col in table[row]) {
          console.log(table[row][col], row, col, number)
          if (table[row][col] == 0) {
            zeroInd = [parseInt(row), parseInt(col)]
          } if (table[row][col] == number) {
            numInd = [parseInt(row), parseInt(col)]
          }
        }

      }
      if (Math.abs(zeroInd[0] - numInd[0]) + Math.abs(zeroInd[1] - numInd[1]) != 1) {
        alert('Nice try, cheater!') 
        return 
      }
      console.log(zeroInd, numInd)
      table[zeroInd[0]][zeroInd[1]] = number 
      table[numInd[0]][numInd[1]] = 0
      render(table)
    } 
  }
}

function h(scene) {
  let distance = 0
  for (i = 0; i < n; i++) {
    for (j = 0; j < n; j++) {
      if (scene[i][j] != i *n + j) {
        if (i != 0 || j != 0) {
          distance++
        }
      }
    }
  }

  return distance
}

function swap(scene, ind1, ind2) {
  let new_scene = []

  for (s of scene) {
    new_scene.push(s.slice())
  }

  let temp = new_scene[ind1[0]][ind1[1]]
  new_scene[ind1[0]][ind1[1]] = new_scene[ind2[0]][ind2[1]]
  new_scene[ind2[0]][ind2[1]] = temp
  
  return new_scene
}

function check(scene) {
  for (i = 0; i < n; i++) {
    for (j = 0; j < n; j++) {
      if (scene[i][j] != i *n + j) {
        return false
      }
    }
  }
  return true
}

function ans(start_scene) {
  let scene_tree = [start_scene]
  let level = 0

  let seen = {}
  let distance = {}
  distance[start_scene] = 0
  let next_level
  function helper(a, b, dist) {
    let scene2 = swap(scene, a, b)
    if (!(scene2 in seen)) {
      next_level.push(scene2)
      seen[scene2] = scene 
    }
    if (scene2 in distance) {
      distance[scene2] = Math.min(distance[scene2], dist + 1)
    } else {
      distance[scene2] = dist + 1
    }
  }

  while (true) {
    for (scene of scene_tree) {
      if (check(scene)) {
        let result = []
        while ('' + (scene) != '' + (start_scene)) {
          result.push(scene)
          scene = seen[scene]
        }
        return result.reverse()
      }
    }

    while (true) {
      next_level = []
      for (scene of scene_tree) {
        let dist = distance[scene]

        if (dist + h(scene) > level) {
          continue
        }

        let zero_x, zero_y

        scene.forEach((row, y) => {
          row.forEach((v, x) => {
            if (v == 0) {
              zero_x = x
              zero_y = y 
            }
          })
        })

        if (zero_x > 0) {
          helper([zero_y, zero_x], [zero_y, zero_x - 1], dist)
        }

        if (zero_y > 0) {
           helper([zero_y, zero_x], [zero_y - 1, zero_x], dist)
        }

        if (zero_x < scene[0].length - 1) {
          helper([zero_y, zero_x], [zero_y, zero_x + 1], dist)
        }

        if (zero_y < scene[0].length - 1) {
          helper([zero_y, zero_x], [zero_y + 1, zero_x], dist)
        }

      }
      scene_tree.push(...next_level)
      console.log(level + ' ' + scene_tree.length)
      if (next_level.length == 0) {
        break
      }

    }
    level++
    
  }
}

render()

function solve() {
  let answer = ans(table)
  let step = () => {
    if (answer.length > 0) {
      table = answer[0]
      render()
      
      console.log(answer.shift())
      setTimeout(step, 1000)
    }
    else {
      document.getElementById('solve').innerText = 'Solve'
    }
  }
  step()

}

//console.log(ans(table))
