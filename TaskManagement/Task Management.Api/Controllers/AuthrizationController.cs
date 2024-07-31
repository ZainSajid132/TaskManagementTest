using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Task.Model;
using Task.Service.Interface;
using TaskRepositry.Entity;

namespace Task_Management.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthrizationController : ControllerBase
    {
        private IAuthrization _authrization;
        private IConfiguration configuration;

        public AuthrizationController(IAuthrization _authrization, IConfiguration configuration)
        {
            this.configuration = configuration;
            this._authrization = _authrization;
        }

        [HttpPost]
        public string Authrization([FromBody] AuthrizationModel authrizationModel)
        {

            var authInfo =  _authrization.Get(authrizationModel).Result;
            var token =  GenerateJwtToken(authInfo);
            return token;
        }

        private  string GenerateJwtToken(AuthUser Authinfo)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                    new Claim(ClaimTypes.NameIdentifier, Authinfo.Email),
                    new Claim(ClaimTypes.Role, Authinfo.RoleName)
            };

            var tokenDescriptor = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(60),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }

    }
}
