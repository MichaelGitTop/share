const { pool, router, Result } = require("../connect");

// 查询
router.get("/getList", ( req, res ) => {
  pool.getConnection(( err, conn ) => {
    conn.query("SELECT * FROM todolist", ( e, data ) => {
      res.json(new Result({ data }));
    });
    conn.release();
  });
});

// 新增
router.post("/addToDo", ( req, res ) => {
  console.log(req.body);
  if ( !req.body.name || !req.body.beginTime || !req.body.endTime || !req.body.object || !req.body.mark ) {
    res.json({
      code: 400,
      msg: "参数有误",
      data: null
    });
    return;
  }
  // 如果参数值是string类型，那么用单引号包起来
  for ( let i in req.body ) {
    if ( typeof req.body[i] === "string" ) {
      req.body[i] = `'${req.body[i]}'`;
    }
  }
  pool.getConnection(( err, conn ) => {
    conn.query(`INSERT INTO todolist (name, beginTime, endTime, object, mark) values (${req.body.name}, ${req.body.beginTime}, ${req.body.endTime}, ${req.body.object}, ${req.body.mark})`, ( e, data ) => {
      console.log(data);
      console.log(e);
      res.json(new Result({ msg: "增加成功" }));
    });
    conn.release();
  });
});

// 删除
router.post("/deleToDo", ( req, res ) => {
  if ( !req.body.id ) {
    res.json({
      code: 400,
      msg: "参数有误",
      data: null
    });
    return;
  }
  // 如果参数值是string类型，那么用单引号包起来
  for ( let i in req.body ) {
    if ( typeof req.body[i] === "string" ) {
      req.body[i] = `'${req.body[i]}'`;
    }
  }
  pool.getConnection(( err, conn ) => {
    conn.query(`DELETE FROM todolist WHERE id = ${req.body.id}`, ( e, data ) => {
      const isExist = data.affectedRows > 0 ? true : false;
      if(isExist) {
        res.json(new Result({ msg: "删除成功" }));
      } else {
        res.json(new Result({ code: 400, msg: "ID不存在" }));
      }
    });
    conn.release();
  });
});

// 编辑
router.post("/editTodo", ( req, res ) => {
  if ( !req.body.id || !req.body.name || !req.body.beginTime || !req.body.endTime || !req.body.object || !req.body.mark ) {
    res.json({
      code: 400,
      msg: "参数有误",
      data: null
    });
    return;
  }
  // 如果参数值是string类型，那么用单引号包起来
  for ( let i in req.body ) {
    if ( typeof req.body[i] === "string" ) {
      req.body[i] = `'${req.body[i]}'`;
    }
  }
  pool.getConnection((err, conn) => {
    conn.query(`UPDATE todolist SET name=${req.body.name}, beginTime=${req.body.beginTime}, endTime=${req.body.endTime}, object=${req.body.object}, mark=${req.body.mark} WHERE id=${req.body.id}`, (e, data) => {

      console.log(data);
      console.log(e);
      if(!e) {
        const isExist = data.affectedRows > 0 ? true : false;
        if(isExist) {
          res.json(new Result({ msg: "更新成功" }));
        } else {
          res.json(new Result({ code: 400, msg: "ID不存在" }));
        }
      } else {
        // 数据库语句异常
        res.json(new Result({ code: 400, msg: e.sqlMessage }));
      }
    })
    conn.release();
  })
});

module.exports = router;
