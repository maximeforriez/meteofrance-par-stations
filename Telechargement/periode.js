let periode = [];
for(let i = 1850 ; i <= 2019 ; i = i + 10)
{
	periode.push(i.toString() + "-" + (i + 9).toString());
}
periode.push("2020-2023");
periode.push("2024-2025");

module.exports = {periode};