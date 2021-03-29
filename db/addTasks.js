const Task = require("./models/Task");

const task1 = new Task({
  name: "A and (B or C)",
  data: {
    false: {
      false: {
        false: false,
        true: false
      },
      true: {
        false: false,
        true: false
      }
    },
    true: {
      false: {
        false: false,
        true: true
      },
      true: {
        false: true,
        true: true
      }
    }
  }
})

const task2 = new Task({
  name: "A or (B and not C)",
  data: {
    false: {
      false: {
        false: true,
        true: false
      },
      true: {
        false: true,
        true: false
      }
    },
    true: {
      false: {
        false: true,
        true: true
      },
      true: {
        false: true,
        true: true
      }
    }
  }
})

const task3 = new Task({
  name: "(not A) and B and C",
  data: {
    false: {
      false: {
        false: false,
        true: false
      },
      true: {
        false: false,
        true: true
      }
    },
    true: {
      false: {
        false: false,
        true: false
      },
      true: {
        false: false,
        true: false
      }
    }
  }
})

module.exports = async function addTasks() {
  await task1.save()
  await task2.save()
  await task3.save()
}