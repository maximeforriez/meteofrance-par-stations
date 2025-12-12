let departement = [];
for(let i = 1 ; i <= 95 ; i++)
{
	if(i < 10)
	{
		departement.push("0" + i);
	}
	else
	{
		departement.push(i.toString());
	}
}
departement.push("99");
for(let i = 971 ; i <= 975 ; i++)
{
	departement.push(i.toString());
}
for(let i = 984 ; i <= 988 ; i++)
{
	departement.push(i.toString());
}
module.exports = {departement};