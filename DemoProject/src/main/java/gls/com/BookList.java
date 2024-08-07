package gls.com;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class BookList
 */
@WebServlet("/BookList")
public class BookList extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public BookList() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//response.getWriter().append("Served at: ").append(request.getContextPath());
		PrintWriter out=response.getWriter();
		try
		{
			Class.forName("com.mysql.cj.jdbc.Driver");
			Connection con=DriverManager.getConnection("jdbc:mysql://localhost:3306/mysql","root","hanisha@3103");
			String retrieveSQL="select id,bname,bauthor,bprice from book";
			PreparedStatement pst=con.prepareStatement(retrieveSQL);
			ResultSet rs=pst.executeQuery();
			out.println("<table border='1' align='center'>");
			out.println("<tr>");
			out.println("<th>Book Id</th>");
			out.println("<th>Book Name</th>");
			out.println("<th>Book Author</th>");
			out.println("<th>Book Price</th>");
			out.println("<th>Edit</th>");
			out.println("<th>Delete</th>");
			out.println("</tr>");
			while(rs.next())
			{
				out.println("<tr>");
				out.println("<td>"+rs.getInt(1)+"</td>");
				out.println("<td>"+rs.getString(2)+"</td>");
				out.println("<td>"+rs.getString(3)+"</td>");
				out.println("<td>"+rs.getString(4)+"</td>");
				out.println("<td><a href='EditScreen?id="+rs.getInt(1)+"'>Edit</a></td>");
				out.println("<td><a href='DeleteUrl?id="+rs.getInt(1)+"'>Delete</a></td>");
				out.println("</tr>");
			}
			out.println("</table>");
		}
		catch(Exception e)
		{
			System.out.println(e);
		}
		out.println("<a href='home.html'>Home</a>");
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//doGet(request, response);
		
	}

}
