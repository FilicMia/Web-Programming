<?php

// Datoteku treba preimenovati u db.class.php
/**
*Vaza na bazu podataka.
*Sadrži ststičku varijablu $db koja predstavlja vezu na bazu. Ukoliko ona još nije uspostavljena, njezina vrijednost je
*{@code null}. Povezivanje na bazu se događa samo u slučaju da kada je $db {@code null}.
*/
class DB
{
	/**Veza na bazu.*/
	private static $db = null;

	private function __construct() { }
	private function __clone() { }

	/**
			*Stvara vezu na bazu ukoliko ona još nije postavljena.
	 */
	public static function getConnection()
	{
		if( DB::$db === null )
	    {
	    	try
	    	{
	    		// Unesi ispravni HOSTNAME, DATABASE, USERNAME i PASSWORD
		    	DB::$db = new PDO( "mysql: host=localhost; dbname=server; charset=utf8", 'root', 'gregbb993' );
		    	//DB::$db = new PDO( "mysql: host=localhost; dbname=server; charset=utf8", 'root', 'mira' );
			    //DB::$db = new PDO( "mysql: host=mysql.hostinger.hr; dbname=u415617757_baza; charset=utf8", 'u415617757_koris', 'pass.mysql' );
			    //DB::$db = new PDO( "mysql: host=rp2.studenti.math.hr; dbname=jukicbraculj; charset=utf8", 'student', 'pass.mysql' );
			    DB::$db-> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		    }
		    catch( PDOException $e ) { exit( 'PDO Error: ' . $e->getMessage() ); }
	    }
		return DB::$db;
	}
}

?>
