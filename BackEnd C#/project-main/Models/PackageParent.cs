namespace project_main.Models
{
    public partial class PackageParent
    {
        public Guid IdPackageParent { get; set; }
        public string PackageParentName { get; set; }
        public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
        public virtual ICollection<Package> Packages { get; set; } = new List<Package>();
    }
}
