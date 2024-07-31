using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Task.Service.Interface;
using TaskRepositry.Entity;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Task_Management.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TaskController : ControllerBase
    {
        /// <summary>
        /// the task service.
        /// </summary>
        private ITaskManagement taskManagement;

        public TaskController(ITaskManagement taskManagement)
        {
                this.taskManagement = taskManagement;
        }
        // GET: api/<TaskController>
        [HttpGet]
        public Task<List<Tasks>> Get()
        {
            return this.taskManagement.GetAllTasks();
        }

        // GET api/<TaskController>/5
        [HttpGet("{id}")]
        public Task<Tasks> Get(int id)
        {
            return this.taskManagement.GetTask(id);
        }

        // POST api/<TaskController>
        [HttpPost]
        public Task<Tasks> Post([FromBody] Tasks tasks)
        {
            return this.taskManagement.CreateTask(tasks);
        }

        // PUT api/<TaskController>/5
        [HttpPut("{id}")]
        public Task<Tasks> Put(int id, [FromBody] Tasks tasks)
        {
            if (!ModelState.IsValid)
            {
                throw new ArgumentException("Invalid model fields.");
            }
            return this.taskManagement.UpdateTask(tasks);
        }

        // DELETE api/<TaskController>/5
        [HttpDelete("{id}")]
        public Task<int> Delete(int id)
        {
            return this.taskManagement.DeleteTask(id);
        }
    }
}
