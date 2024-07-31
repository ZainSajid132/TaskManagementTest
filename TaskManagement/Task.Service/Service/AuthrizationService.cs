using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Task.Model;
using Task.Model.Constants;
using Task.Service.Interface;
using TaskRepositry;
using TaskRepositry.Entity;

namespace Task.Service.Service
{
    public class AuthrizationService : IAuthrization
    {
        
        private readonly TaskContext _taskContext;
        private IHttpContextAccessor _httpContextAccessor;

        public AuthrizationService(TaskContext taskContext, IHttpContextAccessor httpContextAccessor)
        {
                this._httpContextAccessor = httpContextAccessor;
                this._taskContext = taskContext;
        }
        public async Task<AuthUser> Get(AuthrizationModel userAuth)
        {
            return await this._taskContext.AuthUsers.FirstOrDefaultAsync(e => e.Email == userAuth.Email && e.Password == userAuth.Password);
        }

        public string GetCurrentUser()
        {
            var email = string.Empty;
            var userclaim = GetCurrentUserClaim();
            email = userclaim.Email;
            return email;
        }

        public UserClaims GetCurrentUserClaim()
        {
            var claimsIdentity = (ClaimsIdentity)_httpContextAccessor.HttpContext.User.Identity as ClaimsIdentity;
            if (claimsIdentity != null)
            {
                var claims = claimsIdentity.Claims;
                return new UserClaims() { Email = claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value, Role = claims.FirstOrDefault(x => x.Type == ClaimTypes.Role)?.Value };
            }
            else
            {
                throw new ArgumentNullException(string.Empty, "Login again");
            }
        }

        public string GetRegularUser()
        {
            var email = string.Empty;
            var claim = GetCurrentUserClaim();
            if (claim.Role != UserRolesConstant.Admin)
            {
                email = claim.Email;
            }
            return email;
        }
    }
}
