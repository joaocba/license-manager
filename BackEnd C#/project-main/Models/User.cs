﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace project_main.Models;

public partial class User
{
    public Guid IdUser { get; set; }
    public string Name { get; set; }
    public string Password { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public DateTime? InsertDate { get; set; }
    public string Status { get; set; }
    public string Country { get; set; }
    public string Address { get; set; }
    public Guid FkRole { get; set; }
    public Guid FkClient { get; set; }
    public string? Token { get; set; }
    public string? VerificationToken { get; set; }
    public bool? IsVerified { get; set; }
    public string PasswordRecoveryToken { get; set; }
    public DateTime? PasswordRecoveryTokenExpires { get; set; }
    public Guid? FkLicense { get; set; }
    public Guid FkProfilePicture { get; set; }
    public virtual Client FkClientNavigation { get; set; }
    public virtual Role FkRoleNavigation { get; set; }
    public virtual ProfilePicture FkProfilePictureNavigation { get; set; }
    public virtual License FkLicensesNavigation { get; set; }
    public virtual ICollection<Client> Clients { get; set; } = new List<Client>();
    public virtual ICollection<ContactType> ContactTypes { get; set; } = new List<ContactType>();
    public virtual ICollection<Contact> Contacts { get; set; } = new List<Contact>();
    public virtual ICollection<Country> Countries { get; set; } = new List<Country>();
    public virtual ICollection<Module> Modules { get; set; } = new List<Module>();
    public virtual ICollection<Package> Packages { get; set; } = new List<Package>();
    public virtual ICollection<PackagesClientsModule> PackagesClientsModules { get; set; } = new List<PackagesClientsModule>();
    public virtual ICollection<Role> Roles { get; set; } = new List<Role>();
    public virtual ICollection<License> Licenses { get; set; } = new List<License>();
    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    public virtual ICollection<ProfilePicture> ProfilePictures { get; set; } = new List<ProfilePicture>();
}