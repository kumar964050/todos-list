import {useState, useEffect, useRef} from 'react'

// 3rd party packages
import {v4 as uuidV4} from 'uuid'
// icons
import {AiOutlineDelete} from 'react-icons/ai'
// styles
import './app.css'

const App = () => {
  const [tasks, setTasks] = useState([]) // all tasks
  const [newTask, setNewTask] = useState('') // add new task
  const [isError, setIsError] = useState(false) // errors
  const [errorMsg, setErrorMsg] = useState('') // error msgs
  const elRef = useRef()

  //   add new task
  const handleAddTask = e => {
    e.preventDefault()
    if (newTask === '') {
      setIsError(true)
      setErrorMsg('Please add task here')
    } else {
      setIsError(false)
      setErrorMsg('')
      const checkTask = tasks.filter(
        each => each.task.toLowerCase() === newTask.toLowerCase(),
      )
      if (checkTask.length >= 1) {
        setIsError(true)
        setErrorMsg('this task is already added')
      } else {
        setIsError(false)
        setErrorMsg('')
        const newTasks = [
          ...tasks,
          {
            id: uuidV4(),
            task: newTask,
            isCompleted: false,
          },
        ]
        setTasks(newTasks)
        localStorage.setItem('todos', JSON.stringify(newTasks))
        setNewTask('')
      }
    }
  }

  //   delete task
  const deleteTask = id => {
    const filteredData = tasks.filter(each => each.id !== id)
    localStorage.setItem('todos', JSON.stringify(filteredData))
    setTasks(filteredData)
  }
  //   completed rask
  const completeTask = id => {
    const filteredData = JSON.parse(localStorage.getItem('todos')).map(each => {
      if (each.id === id) {
        return {
          ...each,
          isCompleted: true,
        }
      }
      return each
    })
    localStorage.setItem('todos', JSON.stringify(filteredData))
    setTasks(filteredData)
  }
  //   get tasks
  useEffect(() => {
    function getTasks() {
      return localStorage.getItem('todos') === null
        ? []
        : JSON.parse(localStorage.getItem('todos'))
    }
    setTasks(getTasks())
  }, [])

  return (
    <>
      <div className="fluid-container bg-light p-2">
        <div className="row d-flex justify-content-center">
          <h1 className="text-center display-4 fw-semibold p-1">Todos</h1>
          <form
            onSubmit={handleAddTask}
            className="col-12 col-lg-8 d-flex flex-column align-items-center"
          >
            <h1 className="w-100 fs-2">Create Task</h1>
            <div className="w-100 ">
              <input
                type="text"
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                className={`${isError && 'red-border'} form-control-lg w-100`}
                placeholder="What needs to be done ?"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-2">
              Add
            </button>
            {isError && <p className="text-danger">{errorMsg}</p>}
          </form>
          <div className="col-12 col-lg-8 mt-3">
            <h1>Tasks</h1>
            {/*  */}
            <ul className="ul-container">
              {tasks.map(each => (
                <li
                  className="todo-item-container d-flex flex-row"
                  key={each.id}
                  onClick={() => completeTask(each.id)}
                  ref={elRef}
                >
                  {/* checkbox */}
                  {each.isCompleted ? (
                    <input
                      readOnly
                      type="checkbox"
                      checked
                      className="checkbox-input"
                    />
                  ) : (
                    <input
                      readOnly
                      type="checkbox"
                      className="checkbox-input"
                    />
                  )}
                  {/* task */}
                  <div className="label-container d-flex flex-row">
                    <label
                      htmlFor={each.id}
                      className={`${
                        each.isCompleted && 'checked'
                      } checkbox-label`}
                    >
                      {each.task}
                    </label>
                  </div>
                  <div className="d-flex align-items-center">
                    <AiOutlineDelete
                      className="far fa-trash-alt fs-3 text-danger cursor"
                      onClick={() => deleteTask(each.id)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
