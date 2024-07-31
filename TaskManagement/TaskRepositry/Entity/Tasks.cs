using System.ComponentModel.DataAnnotations;
using Task.Common;

namespace TaskRepositry.Entity
{
    public class Tasks
    {
        [Key]
        public int TaskId  { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required DateTime DueDate { get; set; }
        public required string priority { get; set; }
        public string? CreatedBy { get; set; }

    }
}
