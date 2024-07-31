using Microsoft.EntityFrameworkCore;
using TaskRepositry.Entity;

namespace TaskRepositry
{
    public class TaskContext : DbContext
    {
        public TaskContext(DbContextOptions<TaskContext> options):base(options) { }
        public DbSet<Tasks> Tasks { get; set; }
        public DbSet<AuthUser> AuthUsers { get; set; }
    }
}
